require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const Journeys = require("./models/Journeys");
const Stations = require("./models/Stations");

const URL = process.env.DB_URL;
const port = process.env.PORT || 8000;
app.use(express.json());

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: err.message });
});

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
  // Pagination (ensure numeric)
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 5000, 5000);
  const skip = (page - 1) * limit;
    const display = req.query.display || "list";
    const departureStationId = req.query.departureStationId || undefined;
    const returnStationId = req.query.returnStationId || undefined;
    // Exclude very short/short-distance journeys and ensure station ids exist
    const findParams = {
      duration: { $gte: 10 }, // exclude durations < 10s
      covered_distance: { $gte: 10 }, // exclude distances < 10m
      departure_station_id: { $nin: [null, undefined] },
      return_station_id: { $nin: [null, undefined] },
    };
    if (departureStationId) {
      findParams.departure_station_id = departureStationId;
    }
    if (returnStationId) {
      findParams.return_station_id = returnStationId;
    }

    if (display === "count") {
      const count = await Journeys.countDocuments(findParams);
      return res.json(count);
    }

    const journeys = await Journeys.find(findParams).skip(skip).limit(limit);

    return res.json(journeys);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// Fetch all stations
app.get("/stations", async (req, res) => {
  try {
    const stations = await Stations.find({
      fid: { $nin: [null, undefined] },
      id: { $nin: [null, undefined] },
      nimi: { $nin: [null, undefined] },
      namn: { $nin: [null, undefined] },
      name: { $nin: [null, undefined] },
      osoite: { $nin: [null, undefined] },
      address: { $nin: [null, undefined] },
      kaupunki: { $nin: [null, undefined] },
      stad: { $nin: [null, undefined] },
      operaattor: { $nin: [null, undefined] },
      kapasiteet: { $nin: [null, undefined] },
      x: { $nin: [null, undefined] },
      y: { $nin: [null, undefined] },
    });
    return res.json(stations);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
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
