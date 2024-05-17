const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: String,
    adresse: String,
    // Add more fields as needed
});


const Hotel = mongoose.model('Hotel', hotelSchema);


module.exports =  Hotel;
