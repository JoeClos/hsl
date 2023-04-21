import "../App.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../constant";
import { useEffect, useState } from "react";
import { api } from "../config";
import axios from "axios";

const Map = () => {
  const [coord, setCoord] = useState([]);
  // const [position, setPosition] = useState([60.1699, 24.9384]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStationsCoordinates = api + "/stations";
    // navigator.geolocation.getCurrentPosition(
    //   ({ coords }) => {
    //     setPosition({ lat: coords.latitude, lng: coords.longitude });
    //   },
    //   (blocked) => {
    //     if (blocked) {
    //       const fetch = async () => {
    //         try {
    //           const { data } = await axios.get("https://ipapi.co/json");
    //           setPosition({ lat: data.latitude, lng: data.longitude });
    //         } catch (err) {
    //           console.error(err);
    //         }
    //       };
    //       fetch();
    //     }
    //   }
    // );
    axios
      .get(getStationsCoordinates)
      .then((response) => {
        setCoord(response.data);
        setLoading(false);
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
    <MapContainer center={[60.1699, 24.9384]} zoom={12} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors <br/><a target="_blanck" href="https://commons.wikimedia.org/wiki/File:BicycleMarkerSymbol.png">BicycleMarkerSymbol</a>: <a href="https://commons.wikimedia.org/wiki/File:BicycleMarkerSymbol.png">Lindsey.danielson</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>, via Wikimedia Commons'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {coord &&
          coord.map((address, index) => (
            <Marker
              key={index}
              position={[address.y, address.x]}
              title={address.nimi}
              icon={icon}
            >
              <Popup>{address.nimi}</Popup>
            </Marker>
          ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
