import "./App.css";
import Journeys from "./components/Journeys";
import Stations from "./components/Stations";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/journeys" element={<Journeys />} />
        <Route path="/stations" element={<Stations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
