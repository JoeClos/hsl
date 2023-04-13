import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../config";
import { TablePagination } from "@mui/material";
import Search from "./Search";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Journeys = () => {
  const [journeys, setJourneys] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sorted, setSorted] = useState({ sorted: "departure_station_name", reversed: false });
  const [loading, setLoading] = useState(true);

  // Journeys search
  const [search, setSearch] = useState("");

  const handleSearch = (query) => {
    setSearch(query);
  };

  const filteredList = journeys.filter((journey) =>
    journey.departure_station_name.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting journeys
  const sortByName = () => {
    const sortedJourneys = [...journeys];
    sortedJourneys.sort((a, b) => {
      const departureA = `${a.departure_station_name}`;
      const departureB = `${b.departure_station_name}`;
      if (sorted.reversed) {
        return departureB.localeCompare(departureA);
      }
      return departureA.localeCompare(departureB);
    });
    setJourneys(sortedJourneys);
    setSorted({ sorted: "departure_station_name", reversed: !sorted.reversed });
  };

  const renderArrow = () => {
    if (sorted.reversed) {
      return <FaArrowUp />;
    }
    return <FaArrowDown />;
  };

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
        setJourneys(response.data);
        setLoading(false);
        console.log(response.data);
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
    <div>
      <Search handleSearch={handleSearch} />
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={journeys.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <table>
        <thead>
          <tr>
            <th onClick={sortByName}>
              <span style={{ marginRight: 10 }}>Departure</span>
              {sorted.sorted === "departure_station_name" ? renderArrow() : null}
            </th>
            <th>Return</th>
            <th>Covered distance (km)</th>
            <th>Duration (min)</th>
          </tr>
        </thead>
        <tbody>
          {filteredList &&
            filteredList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .sort((a,b) => {
                if(a.departure_station_name.toLowerCase() < b.departure_station_name.toLowerCase()
                )return -1;
                if(a.departure_station_name.toLowerCase() > b.departure_station_name.toLowerCase()
                )return 1;
                return 0;

              })
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
      <Link to={`/`}>Back to home page</Link>
    </div>
  );
};

export default Journeys;
