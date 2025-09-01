import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useMemo, useRef } from "react";
import { api } from "../service/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import icon from "../icon";

import {
  Box,
  Stack,
  Paper,
  Typography,
  Divider,
  Button,
  Skeleton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import "leaflet/dist/leaflet.css";

function MapAutoResize() {
  const map = useMap();
  useEffect(() => {
    const doInvalidate = () => map.invalidateSize({ animate: false });
    const id = setTimeout(doInvalidate, 0);
    window.addEventListener("resize", doInvalidate);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", doInvalidate);
    };
  }, [map]);
  return null;
}

const formatCoordinates = (v) =>
  typeof v === "number" ? v.toFixed(2) : parseFloat(v)?.toFixed(2) ?? "—";

const Station = () => {
  const { stationID } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [station, setStation] = useState(null);
  const [depCount, setDepCount] = useState(null);
  const [retCount, setRetCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openDetails, setOpenDetails] = useState(false);

  const markerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");

    const sReq = axios.get(`${api}/stations/${stationID}`);
    const dReq = axios.get(`${api}/journeys`, {
      params: { display: "count", departureStationId: stationID },
    });
    const rReq = axios.get(`${api}/journeys`, {
      params: { display: "count", returnStationId: stationID },
    });

    Promise.all([sReq, dReq, rReq])
      .then(([s, d, r]) => {
        if (!alive) return;
        setStation(s.data);
        setDepCount(d.data);
        setRetCount(r.data);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message || "Failed to load station");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [stationID]);

  const center = useMemo(() => {
    if (!station) return [60.1699, 24.9384]; // Helsinki fallback
    const lat = Number.parseFloat(station.y);
    const lon = Number.parseFloat(station.x);
    return [
      Number.isFinite(lat) ? lat : 60.1699,
      Number.isFinite(lon) ? lon : 24.9384,
    ];
  }, [station]);

  // auto-open popup on mobile
  useEffect(() => {
    if (isMobile && markerRef.current) {
      // small delay to ensure map has mounted
      const id = setTimeout(() => markerRef.current?.openPopup?.(), 150);
      return () => clearTimeout(id);
    }
  }, [isMobile, center]);

  if (loading) {
    return (
      <Stack spacing={2}>
        <Header title="Station" />
        <Paper sx={{ p: 2 }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="30%" />
        </Paper>
        <Paper sx={{ p: 0, overflow: "hidden" }}>
          <Skeleton variant="rectangular" height={isMobile ? 360 : 520} />
        </Paper>
      </Stack>
    );
  }

  if (err || !station) {
    return (
      <Stack spacing={2}>
        <Header title="Station" />
        <Paper sx={{ p: 2, color: "error.main" }}>
          {err || "Station not found"}
        </Paper>
        <Button
          variant="contained"
          startIcon={<ArrowBackIosIcon />}
          component={Link}
          to="/stations"
          sx={{ alignSelf: "flex-start" }}
        >
          Back to stations
        </Button>
      </Stack>
    );
  }

  return (
    <Box>
      <Header title={station.nimi || station.name || "Station"} />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="stretch"
        sx={{ minHeight: 0 }} // important
      >
        <Paper
          sx={{
            // mobile: small padding; desktop: none
            p: { xs: 1, md: 0 },
            // mobile: don't flex-grow (prevents blank map); desktop: fill
            flexGrow: { xs: 0, md: 1 },
            position: "relative", // containing block for absolute MapContainer
            minWidth: 0,
            minHeight: 0,
            height: { xs: 420, sm: 460, md: 520 },
            overflow: "hidden",
          }}
        >
          <MapContainer
            key={`${isMobile}-${stationID}`} // remount on viewport/id change
            center={center}
            zoom={16}
            scrollWheelZoom
            // Fill the wrapper reliably on all screens
            style={{ position: "absolute", inset: 0 }}
            whenReady={(map) =>
              setTimeout(() => map.target.invalidateSize(), 0)
            }
          >
            <MapAutoResize />
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center} icon={icon} ref={markerRef}>
              <Popup>
                <b>{station.nimi || station.name || "—"}</b>
                <br />
                <b>Address:</b> {station.osoite || station.address || "—"}
                <br />
                <b>Coords:</b> {formatCoordinates(station.y)},{" "}
                {formatCoordinates(station.x)}
              </Popup>
            </Marker>
          </MapContainer>
        </Paper>

        {/* Details: inline on desktop, modal on mobile */}
        {isMobile ? (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              variant="contained"
              onClick={() => setOpenDetails(true)}
              fullWidth
            >
              View details
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIosIcon />}
              component={Link}
              to="/stations"
              fullWidth
            >
              Back
            </Button>
          </Stack>
        ) : (
          <DetailsPanel
            station={station}
            depCount={depCount}
            retCount={retCount}
          />
        )}
      </Stack>

      {/* Details dialog for mobile */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{station.nimi || station.name || "Station"}</DialogTitle>
        <DialogContent dividers>
          <DetailsInner
            station={station}
            depCount={depCount}
            retCount={retCount}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function Header({ title }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Typography
        variant={isMobile ? "h6" : "h5"}
        color="primary"
        sx={{ fontWeight: 700 }}
      >
        {title}
      </Typography>

      {!isMobile && (
        <Button
          variant="outlined"
          startIcon={<ArrowBackIosIcon />}
          component={Link}
          to="/stations"
        >
          Back to stations
        </Button>
      )}
    </Stack>
  );
}

function DetailsPanel({ station, depCount, retCount }) {
  return (
    <Paper sx={{ p: 2, flex: 1, minWidth: 0 }}>
      <DetailsInner station={station} depCount={depCount} retCount={retCount} />
    </Paper>
  );
}

function DetailsInner({ station, depCount, retCount }) {
  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Street address:
      </Typography>

      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
        <LocationOnIcon fontSize="small" color="primary" />
        <Typography variant="body1">
          {station.osoite || station.address || "—"}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <GridRow label="City" value={station.kaupunki || station.stad || "—"} />
      <GridRow label="Operator" value={station.operaattor || "—"} />
      <GridRow label="Capacity" value={station.kapasiteet ?? "—"} />
      <GridRow
        label="Coordinates"
        value={`${formatCoordinates(station.y)}, ${formatCoordinates(
          station.x
        )}`}
      />

      <Divider sx={{ my: 2 }} />

      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2, md: 3 }}>
        {" "}
        <StatBadge
          icon={<DirectionsBikeIcon fontSize="small" />}
          label="Journeys from"
          value={depCount ?? "—"}
        />
        <StatBadge
          icon={<DirectionsBikeIcon fontSize="small" />}
          label="Journeys to"
          value={retCount ?? "—"}
        />
      </Stack>
    </>
  );
}

function GridRow({ label, value }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 0.75 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 92 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Stack>
  );
}

function StatBadge({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default Station;
