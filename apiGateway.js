const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { Kafka } = require('kafkajs');

// Load proto files for hotels and rooms
const hotelProtoPath = 'hotel.proto';
const roomProtoPath = 'room.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Create a new Express application
const app = express();
const hotelProtoDefinition = protoLoader.loadSync(hotelProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const roomProtoDefinition = protoLoader.loadSync(roomProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
app.use(bodyParser.json());
const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;
const roomProto = grpc.loadPackageDefinition(roomProtoDefinition).room;

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'api-gateway-consumer' });

consumer.subscribe({ topic: 'hotels-topic' });
consumer.subscribe({ topic: 'rooms-topic' });

(async () => {
    await consumer.connect();
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message: ${message.value.toString()}, from topic: ${topic}`);
        },
    });
})();

// Create ApolloServer instance with imported schema and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Apply ApolloServer middleware to Express application
server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
    );
});

app.get('/hotels', (req, res) => {
    const client = new hotelProto.HotelService('localhost:50051',
        grpc.credentials.createInsecure());
        const data = req.body;
        const name = data.name;
    client.searchHotels({ name }, (err, response) => {
        if (err) {  
            res.status(500).send(err);
        } else {
            res.json(response.hotels);
        }
    });
});

app.get('/hotels/:id', (req, res) => {
    const client = new hotelProto.HotelService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getHotel({ hotel_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.hotel);
        }
    });
});

app.post('/hotels/add', (req, res) => {
    const client = new hotelProto.HotelService('localhost:50051',
        grpc.credentials.createInsecure());
    const data = req.body;
    const name = data.name;
    const adresse = data.adresse;
    client.addHotel({ name, adresse }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.hotel);
        }
    });
});

app.get('/rooms', (req, res) => {
    const client = new roomProto.RoomService('localhost:50052',
        grpc.credentials.createInsecure());
    client.searchRooms({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.rooms);
        }
    });
});

app.get('/rooms/:id', (req, res) => {
    const client = new roomProto.RoomService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getRoom({ room_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.room);
        }
    });
});

app.post('/rooms/add', (req, res) => {
    const client = new roomProto.RoomService('localhost:50052',
        grpc.credentials.createInsecure());
    const data = req.body;
    const roomnumber = data.roomnumber;
    const description = data.description;
    client.addRoom({ roomnumber, description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.room);
        }
    });
});

// Start Express application
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
});
