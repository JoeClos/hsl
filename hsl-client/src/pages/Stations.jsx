import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../service/api";
import { Link } from "react-router-dom";
import Search from "./Search";
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
  Box,
  Typography,
  Avatar,
  ListItemAvatar,
  tableCellClasses,
  createTheme,
  ThemeProvider,
  // Fab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import Button from "@mui/material/Button";
import ArrowLeftSharpIcon from "@mui/icons-material/ArrowLeftSharp";
import AddIcon from "@mui/icons-material/Add";
import LocationSearchingSharpIcon from "@mui/icons-material/LocationSearchingSharp";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));

const theme = createTheme();

theme.typography.h3 = {
  fontSize: "1.2rem",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
    color: "#1565C0",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

const Stations = () => {
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "1rem",
          margin: "2rem 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <DirectionsBikeIcon
            style={{ color: "#1565C0", fontSize: "1.6rem" }}
          />

          <ThemeProvider theme={theme}>
            <Typography variant="h3">Stations</Typography>
          </ThemeProvider>
        </div>
        {/* <Fab variant="extended">
          <Link to={`/add`} style={{ textDecoration: "none", color: "black" }}>
            Add Station
          </Link>
        </Fab>
        <Fab variant="extended">
          <ArrowLeftSharpIcon sx={{ mr: 1 }} />
          <Link to={`/`} style={{ textDecoration: "none", color: "black" }}>
            Home
          </Link>
        </Fab> */}

        {/* Button to homepage */}
        <Button variant="contained" component={Link} to="/">
          Home
        </Button>

        {/* Button to journeys */}
        <Button variant="contained" component={Link} to="/journeys">
          Journeys
        </Button>

        {/* Button for adding a new station */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/add"
        >
          Add station
        </Button>

        <Search handleSearch={handleSearch} />
      </div>

      <Paper
        elevation={16}
        sx={{ width: "80%", overflow: "hidden", marginLeft: "10rem" }}
      >
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={sortByName}>
                  <span style={{ marginRight: 10 }}> Station name</span>
                  {sorted.sorted === "nimi" ? renderArrow() : null}
                </StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>Operator</StyledTableCell>
                <StyledTableCell>Capacity</StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  Coordinates
                </StyledTableCell>
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
                          <ListItem key={station.id}>
                            <ListItemAvatar>
                              <Avatar>
                                <LocationSearchingSharpIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              secondary={[station.y, <br key={station.id}/>, station.x]}
                            />
                          </ListItem>
                        </List>
                      </TableCell>
                      <TableCell>
                        <Link to={`/stations/${station.id}`} style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                          <ReadMoreOutlinedIcon />
                          See station
                        </Link>
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
          count={stations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </div>
  );
};

export default Stations;
