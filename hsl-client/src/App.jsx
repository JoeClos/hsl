import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import Journeys from "./pages/Journeys";
import Stations from "./pages/Stations";
import Station from "./pages/Station";
import AddStation from "./pages/AddStation";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="journeys" element={<Journeys />} />
        <Route path="stations" element={<Stations />} />
        <Route path="stations/:stationID" element={<Station />} />
        <Route path="add" element={<AddStation />} />
      </Route>
    </Routes>
  );
}

export default App;
