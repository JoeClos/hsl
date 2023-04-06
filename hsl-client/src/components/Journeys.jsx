import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../config";
import { TablePagination } from "@mui/material";
import Search from "./Search";

const Journeys = () => {
  const [journeys, setJourneys] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Journeys search
  const [search, setSearch] = useState("");

  const handleSearch = (query) => {
    setSearch(query);
  };

  const filteredList = (journeys.data || []).filter((journey) =>
    journey.departure_station_name.toLowerCase().includes(search.toLowerCase())  
  );

  // Pagination
  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
      <Search handleSearch={handleSearch} />
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={(journeys.data || []).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <table>
        <tbody>
          <tr>
            <th>Departure</th>
            <th>Return</th>
            <th>Covered distance (km)</th>
            <th>Duration (min)</th>
          </tr>
          {filteredList &&
            filteredList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((journey) => (
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
