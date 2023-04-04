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
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

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
        setStations(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <input
        placeholder="Search..."
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={(stations.data || []).length}
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
                <StyledTableCell>Station name</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>Operator</StyledTableCell>
                <StyledTableCell>Capacity</StyledTableCell>
                <StyledTableCell>Coordinates</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stations.data &&
                stations.data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .filter((item) => {
                    return search.toLowerCase() === ""
                      ? item
                      : item.nimi.toLowerCase().includes(search) ||
                          item.osoite.toLowerCase().includes(search);
                  })
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
                                <LocationOnOutlinedIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Lat" secondary={station.x} />
                          </ListItem>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
                                <LocationOnOutlinedIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Long"
                              secondary={station.y}
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
