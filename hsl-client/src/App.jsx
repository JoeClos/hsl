import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Journeys from "./components/Journeys";
import Stations from "./components/Stations";
import Station from "./components/Station";
import AddStation from "./components/AddStation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/stations/:stationID" element={<Station />} />
        <Route path="/add" element={<AddStation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
