import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { api } from "../service/api";
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
  TextField,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RouteIcon from "@mui/icons-material/Route";
import PlaceIcon from "@mui/icons-material/Place";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import ResponsivePagination from "../components/ResponsivePagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));

const distanceText = (m) => {
  if (m == null) return "—";
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
};
const mins = (s) => {
  if (s == null) return "—";
  const seconds = Math.round(s);
  if (seconds < 60) return `${seconds} s`;

  // Under an hour -> show whole minutes
  if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} m`;
  }

  // 3600s+ -> show hours and remaining minutes, e.g. "1 h 30 m"
  const hours = Math.floor(seconds / 3600);
  let remainingSeconds = seconds - hours * 3600;
  let minutes = Math.round(remainingSeconds / 60);

  // handle rounding edge where minutes === 60 -> carry to hours
  if (minutes === 60) {
    minutes = 0;
    // safe to increment since hours came from floor
    return `${hours + 1} h`;
  }

  return minutes > 0 ? `${hours} h ${minutes} m` : `${hours} h`;
};

const Journeys = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState([]);
  const [sortKey, setSortKey] = useState("departure"); // 'departure' | 'return' | 'distance' | 'duration'
  const [sortDesc, setSortDesc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // client pagination (server returns up to 5000)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setErr("");
    axios
      .get(`${api}/journeys`, { params: { limit: 5000 } })
      .then((res) => setData(res.data || []))
      .catch((e) => setErr(e?.message || "Failed to load journeys"))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key) => {
    setPage(0); // keep UX tidy when sort changes
    // avoid nested state updaters which can require extra clicks in some React batches
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(false);
    }
  };

  const getSortValue = (j, key) => {
    switch (key) {
      case "departure":
        return j?.departure_station_name ?? "";
      case "return":
        return j?.return_station_name ?? "";
      case "distance":
        return typeof j?.covered_distance === "number"
          ? j.covered_distance
          : -1;
      case "duration":
        return typeof j?.duration === "number" ? j.duration : -1;
      default:
        return "";
    }
  };

  const sorted = useMemo(() => {
    const arr = data.slice();

    const collator = new Intl.Collator(undefined, {
      sensitivity: "base",
      numeric: true,
    });
    arr.sort((a, b) => {
      const A = getSortValue(a, sortKey);
      const B = getSortValue(b, sortKey);
      // put null/undefined/"-1" values at the bottom in ascending
      const aMissing = A == null || A === -1 || A === "";
      const bMissing = B == null || B === -1 || B === "";
      if (aMissing && bMissing) return 0;
      if (aMissing) return 1;
      if (bMissing) return -1;
      let cmp;
      if (typeof A === "number" && typeof B === "number") {
        cmp = A - B;
      } else {
        cmp = collator.compare(String(A), String(B));
      }
      return sortDesc ? -cmp : cmp;
    });
    return arr;
  }, [data, sortKey, sortDesc]);

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  if (loading) {
    return (
      <Stack spacing={2}>
        <Header isSmDown={isSmDown} />
        {/* skeleton list on mobile, table skeleton on desktop */}
        {isSmDown ? (
          [...Array(6)].map((_, i) => (
            <Paper key={i} sx={{ p: 2 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="50%" />
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
        <Header />
        <Paper sx={{ p: 2, color: "error.main" }}>{err}</Paper>
      </Stack>
    );
  }

  return (
    <Box>
      <Header isSmDown={isSmDown} />

      {/* Mobile sort controls */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            select
            size="small"
            label="Sort by"
            value={sortKey}
            onChange={(e) => handleSort(e.target.value)}
            slotProps={{ select: { native: true } }}
          >
            <option value="departure">Departure</option>
            <option value="return">Return</option>
            <option value="distance">Distance</option>
            <option value="duration">Duration</option>
          </TextField>
          <IconButton
            aria-label="Toggle sort direction"
            onClick={() => setSortDesc((d) => !d)}
          >
            {sortDesc ? <FaArrowAltCircleDown /> : <FaArrowAltCircleUp />}
          </IconButton>
        </Stack>
      </Box>

      {/* TOP pager on mobile */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
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

      {/* Mobile/tablet: cards */}
      {isSmDown ? (
        <Stack spacing={1.5} sx={{ pb: 2 }}>
          {paged.map((j, i) => (
            <Card
              key={
                j._id || `${j.departure_station_id}-${j.return_station_id}-${i}`
              }
              sx={{
                mb: i === paged.length - 1 ? 2 : 0,
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {j.departure_station_name || "—"}
                </Typography>
                <Row
                  icon={<PlaceIcon fontSize="small" />}
                  label="Return"
                  value={j.return_station_name || "—"}
                />
                <Row
                  icon={<RouteIcon fontSize="small" />}
                  label="Distance"
                  value={distanceText(j.covered_distance)}
                />
                <Row
                  icon={<AccessTimeIcon fontSize="small" />}
                  label="Duration"
                  value={mins(j.duration)}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button size="small" disabled>
                  Details
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        // Desktop: table
        <Paper elevation={16}>
          <TableContainer
            sx={{ maxHeight: 560, maxWidth: "100%", overflow: "auto" }}
          >
            <Table
              stickyHeader
              size="small"
              aria-label="journeys table"
              sx={{ tableLayout: "fixed" }}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    sortDirection={
                      sortKey === "departure"
                        ? sortDesc
                          ? "desc"
                          : "asc"
                        : false
                    }
                    sx={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => handleSort("departure")}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>Departure</span>
                      {sortKey === "departure" &&
                        (sortDesc ? (
                          <FaArrowAltCircleDown
                            color={theme.palette.common.white}
                          />
                        ) : (
                          <FaArrowAltCircleUp
                            color={theme.palette.common.white}
                          />
                        ))}
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell
                    sortDirection={
                      sortKey === "return" ? (sortDesc ? "desc" : "asc") : false
                    }
                    sx={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => handleSort("return")}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>Return</span>
                      {sortKey === "return" &&
                        (sortDesc ? (
                          <FaArrowAltCircleDown
                            color={theme.palette.common.white}
                          />
                        ) : (
                          <FaArrowAltCircleUp
                            color={theme.palette.common.white}
                          />
                        ))}
                    </Stack>
                  </StyledTableCell>

                  <StyledTableCell
                    align="right"
                    sortDirection={
                      sortKey === "distance"
                        ? sortDesc
                          ? "desc"
                          : "asc"
                        : false
                    }
                    sx={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => handleSort("distance")}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <span>Distance</span>
                      {sortKey === "distance" &&
                        (sortDesc ? (
                          <FaArrowAltCircleDown
                            color={theme.palette.common.white}
                          />
                        ) : (
                          <FaArrowAltCircleUp
                            color={theme.palette.common.white}
                          />
                        ))}
                    </Stack>
                  </StyledTableCell>

                  <StyledTableCell
                    align="right"
                    sortDirection={
                      sortKey === "duration"
                        ? sortDesc
                          ? "desc"
                          : "asc"
                        : false
                    }
                    sx={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => handleSort("duration")}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <span>Duration</span>
                      {sortKey === "duration" &&
                        (sortDesc ? (
                          <FaArrowAltCircleDown
                            color={theme.palette.common.white}
                          />
                        ) : (
                          <FaArrowAltCircleUp
                            color={theme.palette.common.white}
                          />
                        ))}
                    </Stack>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((j, i) => (
                  <TableRow
                    hover
                    key={
                      j._id ||
                      `${j.departure_station_id}-${j.return_station_id}-${i}`
                    }
                  >
                    <TableCell>{j.departure_station_name}</TableCell>
                    <TableCell>{j.return_station_name}</TableCell>
                    <TableCell align="right">
                      {distanceText(j.covered_distance)}
                    </TableCell>
                    <TableCell align="right">{mins(j.duration)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* BOTTOM pager on desktop/tablet only */}
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
    </Box>
  );
};

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
        <Typography
          variant={isSmDown ? "h6" : "h5"}
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Journeys
        </Typography>
      </Stack>
      {/* future search/filter spot */}
    </Stack>
  );
}

function Row({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.5 }}>
      <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 78 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default Journeys;
