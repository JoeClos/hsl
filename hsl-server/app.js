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

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Get homepage
app.get("/", (req, res) => {
  res.send("Welcome to SERVER");
});

// Fetch all journeys
app.get("/journeys", async (req, res) => {
  // Pagination
  // const page = req.query.page || 1;
  // const limit = req.query.limit || 10;
  // const skip = (page - 1) * limit;
  // const journeys = await Journeys.find().skip(skip).limit(limit);

  const journeys = await Journeys.find({
    duration: { $gt: 10 },
    covered_distance: { $gt: 10 },
  }).limit(5000);

  res.json(journeys);
});

app.get("/stations", async (req, res) => {
  const stations = await Stations.find();
  res.json(stations);
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});