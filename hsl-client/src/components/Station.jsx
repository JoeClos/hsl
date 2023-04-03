import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { api } from "../config";

const Station = () => {
  const { stationID } = useParams();
//   console.log(stationID);

  const [station, setStation] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const getStationById = api + `/stations/${stationID}`;
    // console.log(getStationById);

    axios
      .get(getStationById)
      .then((response) => {
        setStation(response);
        console.log(response);
      })
      .catch((err) => {
            console.log(err);
        setError(err.message);
      });
  }, [stationID]);

  if(station === undefined) {
    return (
      <div>{error || "Loading"} </div>
    )
  }

  return (
  <div>
    <h3>{station.data.nimi}</h3>
    <p>{station.data.osoite}</p> 
    <p>Total numbers of journeys starting from {station.data.nimi}: </p>
    <p>Total number of journeys ending at the {station.data.nimi}:</p>
  </div>
  );
};

export default Station;
