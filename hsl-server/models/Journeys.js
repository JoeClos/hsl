const mongoose = require('mongoose')

// Create journey schema
const JourneysSchema = new mongoose.Schema({
    departure: String,
    return: String,
    departure_station_id: Number,
    departure_station_name: String,
    return_station_id: Number,
    return_station_name: String,
    covered_distance: Number,
    duration: Number
})

const JourneysModel = mongoose.model('journeys', JourneysSchema)
module.exports = JourneysModel