import "../App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import icon from "../constant";
import { useEffect, useState } from "react";
import { api } from "../config";
import axios from "axios";

const Map = ({stations}) => {
  const [coord, setCoord] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStationsCoordinates = api + "/stations";
    axios
      .get(getStationsCoordinates)
      .then((response) => {
        setCoord(response.data);
        setLoading(false);
        console.log(response.data[0].x, response.data[0].y);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="position">
        <div className="loader"></div>
        <h3>Loading ...</h3>
      </div>
    );
  }

  return (
    <MapContainer center={[60.1699, 24.9384]} zoom={12} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coord &&
        coord.map((c, index) => (
          <Marker key={index} position={[c.y, c.x]} icon={icon}>
            <Popup>{c.nimi}</Popup>
          </Marker> 
        ))}
    </MapContainer>
  );
};

export default Map;
