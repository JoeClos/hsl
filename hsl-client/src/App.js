import "./App.css";
import Journeys from "./components/Journeys";
import Stations from "./components/Stations";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Station from "./components/Station";
import HomePage from "./components/HomePage";
import Map from "./components/Map";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/stations/:stationID" element={<Station />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
