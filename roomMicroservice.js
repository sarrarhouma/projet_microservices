const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Room = require('./models/roomModel'); 
const { Kafka } = require('kafkajs');

const roomProtoPath = 'room.proto'; 
const roomProtoDefinition = protoLoader.loadSync(roomProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();
const roomProto = grpc.loadPackageDefinition(roomProtoDefinition).room;

const url = 'mongodb://localhost:27017/roomsDB'; 
mongoose.connect(url)
    .then(() => {
        console.log('connected to database!');
    }).catch((err) => {
        console.log(err);
    })

const roomService = {
    getRoom: async (call, callback) => {
        await producer.connect();
        try {
            const roomId = call.request.room_id;
            const room = await Room.findOne({ _id: roomId }).exec();
            await producer.send({
                topic: 'rooms-topic',
                messages: [{ value: 'Searched for room id : ' + roomId.toString() }],
            });
            if (!room) {
                callback({ code: grpc.status.NOT_FOUND, message: 'Room not found' });
                return;
            }
            callback(null, { room });
        } catch (error) {
            await producer.send({
                topic: 'rooms-topic',
                messages: [{ value: `Error occurred while fetching room: ${error}` }],
            });
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching room' });
        }
    },
    searchRooms: async (call, callback) => {
        try {
            const rooms = await Room.find({}).exec();
            await producer.connect();
            await producer.send({
                topic: 'rooms-topic',
                messages: [{ value: 'Searched for Rooms' }],
            });

            callback(null, { rooms });
        } catch (error) {
            await producer.connect();
            await producer.send({
                topic: 'rooms-topic',
                messages: [{ value: `Error occurred while fetching Rooms: ${error}` }],
            });

            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while fetching Rooms' });
        }
    },
    addRoom: async (call, callback) => {
        const { roomnumber, description } = call.request; 
        const newRoom = new Room({ roomnumber, description }); 

        try {
            await producer.connect();
            await producer.send({
                topic: 'rooms-topic',
                messages: [{ value: JSON.stringify(newRoom) }],
            });
            await producer.disconnect();
            const savedRoom = await newRoom.save();
            callback(null, { room: savedRoom });
        } catch (error) {
            callback({ code: grpc.status.INTERNAL, message: 'Error occurred while adding room' });
        }
    }
};

const server = new grpc.Server();
server.addService(roomProto.RoomService.service, roomService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Failed to bind server:', err);
            return;
        }
        console.log(`Server is running on port ${port}`);
        server.start();
    });
console.log(`Room microservice is running on port ${port}`);
