const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Hotel {
        id: String!
        name: String!
        adresse: String!
    }

    type Room {
        id: String!
        roomnumber: String! 
        description: String!
    }

    type Query {
        hotel(id: String!): Hotel
        hotels: [Hotel]
        room(id: String!): Room
        rooms: [Room]
    }

    type Mutation {
        addHotel(name: String!, adresse: String!): Hotel
        addRoom(roomnumber: String!, description: String!): Room 
    }
`;

module.exports = typeDefs;
