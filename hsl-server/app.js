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
// app.options('*', cors())

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

// Get homepage
app.get("/", (req, res) => {
  res.send("Welcome to SERVER");
});

// Fetch all journeys + counting stations starting from the station and ending to the station
app.get("/journeys", async (req, res) => {
  res.header({ "Cache-control": "public, max-age=300" });
  try {
    // Pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 5000;
    const skip = (page - 1) * limit;
    const display = req.query.display || "list";
    const departureStationId = req.query.departureStationId || undefined;
    const returnStationId = req.query.returnStationId || undefined;
    const findParams = {
      duration: { $gt: 10 },
      covered_distance: { $gt: 10 },
    };
    if (departureStationId) {
      findParams.departure_station_id = departureStationId;
    }
    if (returnStationId) {
      findParams.return_station_id = returnStationId;
    }
    const journeys = Journeys.find(findParams).skip(skip).limit(limit);
    if (display === "count") {
      res.json(await journeys.count());
      return;
    }

    res.json(await journeys);
  } catch (e) {
    console.error(e);
  }
});

// Fetch all stations
app.get("/stations", async (req, res) => {
  try {
    const stations = await Stations.find({
      fid: { $ne: null || undefined},
      id: { $ne: null || undefined},
      nimi: { $ne: null || undefined},
      namn: { $ne: null || undefined},
      name: { $ne: null || undefined},
      osoite: { $ne: null || undefined},
      address: { $ne: null || undefined},
      kaupunki: { $ne: null || undefined},
      stad: { $ne: null || undefined},
      operaattor: { $ne: null || undefined},
      kapasiteet: { $ne: null || undefined},
      x: { $ne: null || undefined},
      y: { $ne: null || undefined},
    });
    res.json(stations);
  } catch (e) {
    console.error(e);
  }
});

// Create Station
app.post("/addStation", async (req, res) => {
  // new station
  const newStation = new Stations({
    fid: req.body.fid,
    id: req.body.fid,
    nimi: req.body.nimi,
    namn: req.body.namn,
    name: req.body.name,
    osoite: req.body.osoite,
    address: req.body.address,
    kaupunki: req.body.kaupunki,
    stad: req.body.stad,
    operaattor: req.body.operaattor,
    kapasiteet: req.body.kapasiteet,
    x: req.body.x,
    y: req.body.y,
  });

  try {
    await newStation.save();
    console.log(newStation);
    res.status(201).json(newStation);
  } catch (e) {
    console.error(e);
  }
});

// Fetch station by ID
app.get("/stations/:id", async (req, res) => {
  res.header({ "Cache-control": "public, max-age=300" });
  try {
    const stationID = await Stations.find({ id: req.params.id });
    console.log(stationID);
    res.json(stationID[0]);
  } catch (e) {
    console.error(e);
  }
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
