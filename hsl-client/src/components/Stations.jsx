import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../config";

const Stations = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const getJourneys = api + "/stations";

    axios
      .get(getJourneys)
      .then((response) => {
        setStations(response);
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
            <th>Station name</th>
            <th>Address</th>
            <th>City</th>
            <th>Operator</th>
            <th>Capacity</th>
            <th>Coordinates</th>
          </tr>
          {stations.data &&
            stations.data.map((station) => (
              <tr key={station._id}>
                <td>{station.name}</td>
                <td>{station.osoite}</td>
                <td>{station.kaupunki}</td>
                <td>{station.operaattor}</td>
                <td>{station.kapasiteet}</td>
                <td>
                  <ul>
                    <li>Lat: {station.x}</li>
                    <li>Long: {station.y}</li>
                  </ul>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stations;
