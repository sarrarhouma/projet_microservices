const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// Charger le fichier proto pour les hôtels
const hotelProtoPath = 'hotel.proto';
const roomProtoPath = 'room.proto';
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
const hotelProto = grpc.loadPackageDefinition(hotelProtoDefinition).hotel;
const roomProto = grpc.loadPackageDefinition(roomProtoDefinition).room;
// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
    Query: {
        hotel: (_, { id }) => {
            // Effectuer un appel gRPC au microservice d'hôtels
            const client = new hotelProto.HotelService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getHotel({ hotel_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.hotel);
                    }
                });
            });
        },
        hotels: () => {
            // Effectuer un appel gRPC au microservice d'hôtels
            const client = new hotelProto.HotelService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchHotels({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.hotels);
                    }
                });
            });
        },
        room: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de chambres
            const client = new roomProto.RoomService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getRoom({ room_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.room);
                    }
                });
            });
        },
        rooms: () => {
            // Effectuer un appel gRPC au microservice de chambres
            const client = new roomProto.RoomService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchRooms({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.rooms);
                    }
                });
            });
        },
    },
    Mutation: {
        addHotel: (_, { name, adresse }) => {
            const client = new hotelProto.HotelService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.addHotel({ name, adresse }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.hotel);
                    }
                });
            });
        },
        addRoom: (_, { roomnumber, description }) => {
            const client = new roomProto.RoomService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.addRoom({ roomnumber, description }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.room);
                    }
                });
            });
        },
    },
};
module.exports = resolvers;
