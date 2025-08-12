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
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RouteIcon from "@mui/icons-material/Route";
import PlaceIcon from "@mui/icons-material/Place";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { mobileBottomNavOffset } from "../theme";
import ResponsivePagination from "../components/ResponsivePagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));

const km = (m) => (m == null ? "—" : `${(m / 1000).toFixed(1)} km`);
const mins = (s) => (s == null ? "—" : `${Math.round(s / 60)} min`);

const Journeys = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState([]);
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

  const sorted = useMemo(() => {
    const arr = data.slice();
    arr.sort((a, b) => {
      const A = (a?.departure_station_name || "").toString();
      const B = (b?.departure_station_name || "").toString();
      return sortDesc ? B.localeCompare(A) : A.localeCompare(B);
    });
    return arr;
  }, [data, sortDesc]);

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
      <Header />

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

      {/* Mobile/tablet: cards */}
      {isSmDown ? (
        <Stack spacing={1.5}>
          {paged.map((j, i) => (
            <Card
              key={
                j._id || `${j.departure_station_id}-${j.return_station_id}-${i}`
              }
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
                  value={km(j.covered_distance)}
                />
                <Row
                  icon={<AccessTimeIcon fontSize="small" />}
                  label="Duration"
                  value={mins(j.duration)}
                />
              </CardContent>
              {/* Keep actions area for future deep-linking */}
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
        <Paper elevation={16} sx={{ overflow: "hidden" }}>
          <TableContainer
            sx={{ maxHeight: 560, maxWidth: "100%", overflowX: "auto" }}
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
                    onClick={() => setSortDesc((d) => !d)}
                    sx={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>Departure</span>
                      {sortDesc ? (
                        <FaArrowAltCircleDown />
                      ) : (
                        <FaArrowAltCircleUp />
                      )}
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell>Return</StyledTableCell>
                  <StyledTableCell>Distance</StyledTableCell>
                  <StyledTableCell>Duration</StyledTableCell>
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
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{j.departure_station_name}</TableCell>
                    <TableCell>{j.return_station_name}</TableCell>
                    <TableCell>{km(j.covered_distance)}</TableCell>
                    <TableCell>{mins(j.duration)}</TableCell>
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

      {/* Extra bottom space on mobile so content doesn’t sit behind bottom nav */}
      <Box
        sx={{ mb: mobileBottomNavOffset, display: { xs: "block", md: "none" } }}
      />
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
          variant={isSmDown ? "h6" : "h5"} // smaller heading on mobile
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
