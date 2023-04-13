import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../config";
import { Link } from "react-router-dom";
import {
  Paper,
  Table,
  TablePagination,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Search from "./Search";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import Fab from "@mui/material/Fab";
import ArrowLeftSharpIcon from "@mui/icons-material/ArrowLeftSharp";
import LocationSearchingSharpIcon from "@mui/icons-material/LocationSearchingSharp";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const Stations = (props) => {
  const [stations, setStations] = useState([]);
  const [sorted, setSorted] = useState({ sorted: "nimi", reversed: false });
  const [loading, setLoading] = useState(true);

  // Stations search
  const [search, setSearch] = useState("");

  const handleSearch = (query) => {
    setSearch(query);
  };

  const filteredList = stations.filter((station) =>
    station.nimi.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting stations
  const sortByName = () => {
    const sortedStations = [...stations];
    sortedStations.sort((a, b) => {
      const departureA = `${a.nimi}`;
      const departureB = `${b.nimi}`;
      if (sorted.reversed) {
        return departureB.localeCompare(departureA);
      }
      return departureA.localeCompare(departureB);
    });
    setStations(sortedStations);
    setSorted({ sorted: "nimi", reversed: !sorted.reversed });
  };

  const renderArrow = () => {
    if (sorted.reversed) {
      return <FaArrowAltCircleUp />;
    }
    return <FaArrowAltCircleDown />;
  };

  // List pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const getJourneys = api + "/stations";

    axios
      .get(getJourneys)
      .then((response) => {
        setStations(response.data);
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
      <div>
        <Search handleSearch={handleSearch} />
        <Fab variant="extended">
          <ArrowLeftSharpIcon sx={{ mr: 1 }} />
          <Link to={`/`} style={{ textDecoration: "none", color: "black" }}>
            Home
          </Link>
        </Fab>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={stations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={sortByName}>
                  <span style={{ marginRight: 10 }}> Station name</span>
                  {sorted.sorted === "departure_station_name"
                    ? renderArrow()
                    : null}
                </StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>Operator</StyledTableCell>
                <StyledTableCell>Capacity</StyledTableCell>
                <StyledTableCell>Coordinates</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList &&
                filteredList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((station) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={station._id}
                    >
                      <TableCell>{station.name}</TableCell>
                      <TableCell>{station.osoite}</TableCell>
                      <TableCell>{station.kaupunki}</TableCell>
                      <TableCell>{station.operaattor}</TableCell>
                      <TableCell>{station.kapasiteet}</TableCell>
                      <TableCell>
                        <List>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <LocationSearchingSharpIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              secondary={[station.y, <br />, station.x]}
                            />
                          </ListItem>
                        </List>
                      </TableCell>
                      <TableCell>
                        <Link to={`/stations/${station._id}`}>
                          <ReadMoreOutlinedIcon />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default Stations;
