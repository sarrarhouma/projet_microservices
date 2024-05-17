const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomnumber: String,
    description: String,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
