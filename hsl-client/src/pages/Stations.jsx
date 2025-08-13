import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { api } from "../service/api";
import { Link } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Skeleton,
  Avatar,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import PlaceIcon from "@mui/icons-material/Place";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import LocationSearchingSharpIcon from "@mui/icons-material/LocationSearchingSharp";
import ReadMoreOutlinedIcon from "@mui/icons-material/ReadMoreOutlined";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";

import { mobileBottomNavOffset } from "../theme";
import ResponsivePagination from "../components/ResponsivePagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));
const Stations = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [sortDesc, setSortDesc] = useState(false);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Coordinates formatting
  const formatCoordinates = (val) =>
  typeof val === "number" ? val.toFixed(2) : parseFloat(val)?.toFixed(2) || "—";

  useEffect(() => {
    setLoading(true);
    setErr("");
    axios
      .get(`${api}/stations`)
      .then((res) => setStations(res.data || []))
      .catch((e) => setErr(e?.message || "Failed to load stations"))
      .finally(() => setLoading(false));
  }, []);

  // (search reserved for later global search; currently no filtering)
  const sorted = useMemo(() => {
    const arr = stations.slice();
    arr.sort((a, b) => {
      const A = (a?.nimi || a?.name || "").toString();
      const B = (b?.nimi || b?.name || "").toString();
      return sortDesc ? B.localeCompare(A) : A.localeCompare(B);
    });
    return arr;
  }, [stations, sortDesc]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  // loading UI
  if (loading) {
    return (
      <Stack spacing={2}>
        <Header isSmDown={isSmDown} />
        {isSmDown ? (
          [...Array(6)].map((_, i) => (
            <Paper key={i} sx={{ p: 2 }}>
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="40%" />
            </Paper>
          ))
        ) : (
          <Paper>
            <Box sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={36} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={300} />
            </Box>
          </Paper>
        )}
      </Stack>
    );
  }

  if (err) {
    return (
      <Stack spacing={2}>
        <Header isSmDown={isSmDown} />
        <Paper sx={{ p: 2, color: "error.main" }}>{err}</Paper>
      </Stack>
    );
  }

  return (
    <Box>
      <Header isSmDown={isSmDown} />

      {/* TOP pager on mobile */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <ResponsivePagination
          count={sorted.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          placeTopOnMobile
          sx={{ mb: 1, justifyContent: "center" }}
        />
      </Box>

      {/* Cards (mobile/tablet) */}
      {isSmDown ? (
        <Stack spacing={1.5}>
          {paged.map((s, i) => (
            <Card key={s._id || s.id || `s-${i}`}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {s.nimi || s.name || "—"}
                </Typography>

                <InfoRow icon={<PlaceIcon fontSize="small" />} label="Address" value={s.osoite || s.address || "—"} />
                <InfoRow icon={<DirectionsBikeIcon fontSize="small" />} label="City" value={s.kaupunki || s.stad || "—"} />
                <InfoRow icon={<DirectionsBikeIcon fontSize="small" />} label="Operator" value={s.operaattor || "—"} />
                <InfoRow icon={<DirectionsBikeIcon fontSize="small" />} label="Capacity" value={s.kapasiteet ?? "—"} />

                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 0.5 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <LocationSearchingSharpIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {formatCoordinates(s.y)}, {formatCoordinates(s.x)}
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  component={Link}
                  to={`/stations/${s.id}`}
                  startIcon={<ReadMoreOutlinedIcon />}
                >
                  See station
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        // Table (desktop)
        <Paper elevation={16}>
          <TableContainer sx={{ maxHeight: 560, maxWidth: "100%", overflow: "auto" }}>
            <Table stickyHeader size="small" sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    onClick={() => setSortDesc((d) => !d)}
                    sx={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>Station name</span>
                      {sortDesc ? <FaArrowAltCircleDown /> : <FaArrowAltCircleUp />}
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell>Address</StyledTableCell>
                  <StyledTableCell>City</StyledTableCell>
                  <StyledTableCell>Operator</StyledTableCell>
                  <StyledTableCell>Capacity</StyledTableCell>
                  <StyledTableCell>Coordinates</StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((s, i) => (
                  <TableRow
                    hover
                    key={s._id || s.id || `s-${i}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ wordBreak: "break-word" }}>{s.name || s.nimi}</TableCell>
                    <TableCell sx={{ wordBreak: "break-word" }}>{s.osoite || s.address}</TableCell>
                    <TableCell>{s.kaupunki || s.stad}</TableCell>
                    <TableCell>{s.operaattor}</TableCell>
                    <TableCell>{s.kapasiteet}</TableCell>
                    <TableCell sx={{ wordBreak: "break-word" }}>
                      {formatCoordinates(s.y)}, {formatCoordinates(s.x)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        component={Link}
                        to={`/stations/${s.id}`}
                        startIcon={<ReadMoreOutlinedIcon />}
                      >
                        See station
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* BOTTOM pager on desktop/tablet */}
      <Box sx={{ display: { xs: "none", md: "block" }, mt: 1.5 }}>
        <ResponsivePagination
          count={sorted.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>

      {/* Keep content above bottom nav on mobile */}
      <Box sx={{ mb: mobileBottomNavOffset, display: { xs: "block", md: "none" } }} />
    </Box>
  );
}

function Header({ isSmDown }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <DirectionsBikeIcon color="primary" />
        <Typography variant={isSmDown ? "h6" : "h5"} color="primary" sx={{ fontWeight: 600 }}>
          Stations
        </Typography>
      </Stack>
      {/* Reserved for future global search/filter controls */}
    </Stack>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.5 }}>
      <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 78 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
    </Stack>
  );
}
 export default Stations;