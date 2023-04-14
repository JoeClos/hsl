import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { api } from "../config";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import icon from "../constant";
import "../App.css";
import { Paper } from "@mui/material";
import Fab from "@mui/material/Fab";
import ArrowLeftSharpIcon from '@mui/icons-material/ArrowLeftSharp';

const Station = (props) => {
  const { stationID } = useParams();
  //   console.log(stationID);

  const [station, setStation] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const getStationById = api + `/stations/${stationID}`;

    axios
      .get(getStationById)
      .then((response) => {
        setStation(response);
        console.log(response.data.x);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [stationID, setStation]);

  if (station === undefined) {
    return <div>{error || "Loading"} </div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        padding: "2rem",
        alignItems: "center",
      }}
    >
      <div>
        <h3>{station.data.nimi}</h3>
        <p>
          <b>Address:</b> {station.data.osoite}
        </p>
        <p>Total numbers of journeys starting from {station.data.nimi}: </p>
        <p>Total number of journeys ending at the {station.data.nimi}:</p>
        <Fab variant="extended">
          <ArrowLeftSharpIcon sx={{ mr: 1 }} />
          <Link to={`/stations`} style={{textDecoration: "none", color: "black"}}>Station List</Link>
        </Fab>
        
      </div>
      <Paper elevation={16}>
        <MapContainer
          center={[station.data.y, station.data.x]}
          zoom={22}
          scrollWheelZoom
          id="station-map"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[station.data.y, station.data.x]} icon={icon}>
            <Popup>
              <b>{station.data.nimi}</b> <br />
              <b>Address</b>: {station.data.osoite}
            </Popup>
          </Marker>
        </MapContainer>
      </Paper>
    </div>
  );
};

export default Station;
