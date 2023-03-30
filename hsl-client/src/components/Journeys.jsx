import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../config";

const Journeys = () => {
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    const getJourneys = api + "/journeys";
    axios
      .get(getJourneys)
      .then((response) => {
        setJourneys(response);
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>Departure</th>
            <th>Return</th>
            <th>Covered distance (km)</th>
            <th>Duration (min)</th>
          </tr>
          {journeys.data &&
            journeys.data.map((journey) => (
              <tr key={journey._id}>
                <td>{journey.departure_station_name}</td>
                <td>{journey.return_station_name}</td>
                <td>{(journey.covered_distance / 1000).toFixed(1)} km</td>
                <td>{(journey.duration / 60).toFixed()} min</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Journeys;
