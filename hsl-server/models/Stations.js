const mongoose = require('mongoose')

// Create station schema
const StationSchema = new mongoose.Schema({
    fid: Number,
    id: Number,
    nimi: String,
    namn: String,
    name: String,
    osoite: String,
    address: String,
    kaupunki: String,
    stad: String,
    operaattor: String,
    kapasiteet: Number,
    x: Number,
    y: Number
})

const Stations = mongoose.model('stations', StationSchema);
module.exports = Stations;