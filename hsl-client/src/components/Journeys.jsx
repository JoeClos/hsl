import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../config";
import {
  TablePagination,
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Search from "./Search";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Fab from "@mui/material/Fab";
import ArrowLeftSharpIcon from "@mui/icons-material/ArrowLeftSharp";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));

const Journeys = () => {
  const [journeys, setJourneys] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sorted, setSorted] = useState({
    sorted: "departure_station_name",
    reversed: false,
  });
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
      return <FaArrowAltCircleUp />;
    }
    return <FaArrowAltCircleDown />;
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "1rem",
          margin: "2rem 0",
        }}
      >
        <Fab variant="extended">
          <ArrowLeftSharpIcon sx={{ mr: 1 }} />
          <Link to={`/`} style={{ textDecoration: "none", color: "black" }}>
            Home
          </Link>
        </Fab>
        <Search handleSearch={handleSearch} />
      </div>

      <Paper
        elevation={16}
        sx={{ width: "80%", overflow: "hidden", marginLeft: "10rem" }}
      >
        {" "}
        <TableContainer sx={{ maxHeight: 530 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={sortByName}>
                  <span style={{ marginRight: 10 }}>Departure</span>
                  {sorted.sorted === "departure_station_name"
                    ? renderArrow()
                    : null}
                </StyledTableCell>
                <StyledTableCell>Return</StyledTableCell>
                <StyledTableCell>Covered distance (km)</StyledTableCell>
                <StyledTableCell>Duration (min)</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList &&
                filteredList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .sort((a, b) => {
                    if (
                      a.departure_station_name.toLowerCase() <
                      b.departure_station_name.toLowerCase()
                    )
                      return -1;
                    if (
                      a.departure_station_name.toLowerCase() >
                      b.departure_station_name.toLowerCase()
                    )
                      return 1;
                    return 0;
                  })
                  .map((journey) => (
                    <TableRow
                      key={journey._id}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{journey.departure_station_name}</TableCell>
                      <TableCell>{journey.return_station_name}</TableCell>
                      <TableCell>
                        {(journey.covered_distance / 1000).toFixed(1)} km
                      </TableCell>
                      <TableCell>
                        {(journey.duration / 60).toFixed()} min
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box
        sx={{
          margin: "auto",
          padding: "1rem",
          width: "fit-content",
          alignItems: "center",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={journeys.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </div>
  );
};

export default Journeys;
