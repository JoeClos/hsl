require("dotenv").config();
// const axios = require('axios');
const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const Journeys = require("./models/Journeys");
const Stations = require("./models/Stations");

const URL = process.env.DB_URL;
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB')
}).catch(err => {
  console.error(err)
})

// Get homepage
app.get("/", (req, res) => {
  res.send("Welcome to SERVER");
});

// Fetch all journeys
app.get("/journeys", async (req, res) => {
  res.header({ "Cache-control": "public, max-age=300" });
  try {
    // Pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 10000;
    const skip = (page - 1) * limit;
    const journeys = await Journeys.find({
      duration: { $gt: 10 },
      covered_distance: { $gt: 10 },
    })
      .skip(skip)
      .limit(limit);
    res.json(journeys);
  } catch (e) {
    console.error(e);
  }
});

// Fetch all stations
app.get("/stations", async (req, res) => {
  try {
    const stations = await Stations.find();
    res.json(stations);
  } catch (e) {
    console.error(e);
  }
});

// Fetch station by ID
app.get("/stations/:id", async (req, res) => {
  res.header({ "Cache-control": "public, max-age=300" });
  try {
    const stationID = await Stations.findById(req.params.id);
    console.log(stationID);
    res.json(stationID);
  } catch (e) {
    console.error(e);
  }
});

// count

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
