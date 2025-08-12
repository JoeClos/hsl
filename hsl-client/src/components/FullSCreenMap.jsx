import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import axios from "axios";
import { api } from "../service/api";
import icon from "../icon";

const FullScreenMap = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${api}/stations`)
      .then(res => setStations(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{display:"grid",placeItems:"center",height:"100%"}}>Loading…</div>;
  }

  return (
    <MapContainer
      center={[60.1699, 24.9384]}
      zoom={12}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {stations.map((s, i) => (
          <Marker
            key={s._id || `${s.id}-${s.x}-${s.y}` || `station-${i}`}
            position={[s.y, s.x]}
            title={s.nimi}
            icon={icon}
          >
            <Popup>{s.nimi}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default FullScreenMap;
