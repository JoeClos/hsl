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
import ArrowLeftSharpIcon from "@mui/icons-material/ArrowLeftSharp";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

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
        <Typography
          variant="h4"
          gutterBottom
          textAlign={"center"}
          padding={"3rem"}
        >
          {station.data.nimi}
        </Typography>
        <div style={{ marginBottom: "3rem" }}>
          <Typography variant="body1" gutterBottom>
            {station.data.osoite}
          </Typography>
          <Divider textAlign="left">
            <b>
              <em>ADDRESS</em>
            </b>
          </Divider>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            gap: "10%",
          }}
        >
          <Typography variant="body1" gutterBottom>
            From {station.data.nimi}: <Chip label="COUNT" />
          </Typography>
          <Typography variant="body1" gutterBottom>
            Ending at the {station.data.nimi}: <Chip label="COUNT" />
          </Typography>
        </div>
        <Divider textAlign="center">
          <b>
            <em>TOTAL</em>
          </b>
        </Divider>

        <div style={{textAlign:"center", marginTop:"3rem"}}>
          <Fab variant="extended">
            <Link
              to={`/stations`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ArrowLeftSharpIcon sx={{ mr: 1 }} />
              Station List
            </Link>
          </Fab>
        </div>
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
