import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { api } from "../config";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import icon from "../constant";

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
    <div>
      <div>
        <h3>{station.data.nimi}</h3>
        <p>{station.data.osoite}</p>
        <p>Total numbers of journeys starting from {station.data.nimi}: </p>
        <p>Total number of journeys ending at the {station.data.nimi}:</p>
        <Link to={`/stations`}>Back to stations' list</Link>
      </div>
      <MapContainer
        center={[station.data.y, station.data.x]}
        zoom={22}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[station.data.y, station.data.x]} icon={icon}>
          <Popup>
            {station.data.nimi} <br />
            Address: {station.data.osoite}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Station;
