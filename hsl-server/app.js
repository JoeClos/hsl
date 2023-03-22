require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();
const mongoose = require('mongoose');
const JourneysModel = require('./models/Journeys');

const URL = process.env.DB_URL;
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

mongoose.connect(URL, { useNewUrlParser: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('Connected to MongoDB');
// });

// Get homepage
app.get('/', (req, res) => {
    res.send('Welcome to SERVER')
})

// Fetch all journeys
app.get('/journeys', async (req, res) => {
    const journeys = await JourneysModel.find().limit(100);
    // console.log("Journeys: " + journeys)
    res.json(journeys)
})

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
})