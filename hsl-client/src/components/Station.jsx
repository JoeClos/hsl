import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { api } from "../config";
import { Link } from "react-router-dom";

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
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [stationID]);

  if (station === undefined) {
    return <div>{error || "Loading"} </div>;
  }

  return (
    <div>
      <h3>{station.data.nimi}</h3>
      <p>{station.data.osoite}</p>
      <p>Total numbers of journeys starting from {station.data.nimi}: </p>
      <p>Total number of journeys ending at the {station.data.nimi}:</p>
      <Link to={`/stations`}>Back to stations' list</Link>
    </div>
  );
};

export default Station;
