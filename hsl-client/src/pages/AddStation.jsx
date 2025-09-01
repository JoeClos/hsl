import { useMemo, useRef, useState } from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ToastMessage from "../components/ToastMessage";
import { addStation } from "../service/api";

// --- helpers (stable) ---
const normalizeDecimal = (v) =>
  String(v ?? "")
    .replace(",", ".")
    .trim();
const isNumeric = (v) => {
  if (v === "" || v === null || v === undefined) return false;
  const n = parseFloat(normalizeDecimal(v));
  return Number.isFinite(n);
};
const asInt = (v) => {
  const n = parseInt(String(v).trim(), 10);
  return Number.isFinite(n) ? n : null;
};
const asFloat = (v) => {
  const n = parseFloat(normalizeDecimal(v));
  return Number.isFinite(n) ? n : null;
};

const initialValue = {
  fid: "",
  id: "",
  nimi: "",
  namn: "",
  name: "",
  osoite: "",
  address: "",
  kaupunki: "",
  stad: "",
  operaattor: "",
  kapasiteet: "",
  x: "",
  y: "",
};

const AddStation = () => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));

  const [station, setStation] = useState(initialValue);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  // toast state
  const [toast, setToast] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  // focus ID after reset/success
  const idRef = useRef(null);

  const onValueChange = (e) => {
    const { name, value } = e.target;
    setStation((s) => ({ ...s, [name]: value }));
  };
  const markTouched = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const errors = useMemo(() => {
    const e = {};
    if (!station.id) e.id = "Required";
    else if (!/^\d+$/.test(String(station.id))) e.id = "Must be a number";

    if (!station.nimi && !station.name)
      e.name = "Provide at least 'nimi' or 'name'";

    if (!station.osoite && !station.address)
      e.address = "Provide at least 'osoite' or 'address'";

    if (station.y === "") e.y = "Latitude required";
    else if (!isNumeric(station.y)) e.y = "Must be a number";
    else {
      const lat = asFloat(station.y);
      if (lat < -90 || lat > 90) e.y = "Latitude must be between -90 and 90";
    }

    if (station.x === "") e.x = "Longitude required";
    else if (!isNumeric(station.x)) e.x = "Must be a number";
    else {
      const lon = asFloat(station.x);
      if (lon < -180 || lon > 180)
        e.x = "Longitude must be between -180 and 180";
    }

    if (station.fid !== "" && !/^\d+$/.test(String(station.fid)))
      e.fid = "Must be a number";

    if (station.kapasiteet !== "") {
      if (!/^\d+$/.test(String(station.kapasiteet)))
        e.kapasiteet = "Must be a number";
      else if (parseInt(station.kapasiteet, 10) < 0)
        e.kapasiteet = "Must be ≥ 0";
    }
    return e;
  }, [station]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const buildPayload = () => {
    const trim = (v) => (typeof v === "string" ? v.trim() : v);
    return {
      fid: station.fid === "" ? null : asInt(trim(station.fid)),
      id: asInt(trim(station.id)),
      nimi: trim(station.nimi),
      namn: trim(station.namn),
      name: trim(station.name),
      osoite: trim(station.osoite),
      address: trim(station.address),
      kaupunki: trim(station.kaupunki),
      stad: trim(station.stad),
      operaattor: trim(station.operaattor),
      kapasiteet:
        station.kapasiteet === "" ? null : asInt(trim(station.kapasiteet)),
      x: asFloat(trim(station.x)),
      y: asFloat(trim(station.y)),
    };
  };

  const focusFirstError = () => {
    const firstErrField = Object.keys(errors)[0];
    if (firstErrField) {
      const el = document.querySelector(`[name="${firstErrField}"]`);
      if (el && "focus" in el) el.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched((t) => ({
      ...t,
      id: true,
      nimi: true,
      name: true,
      osoite: true,
      address: true,
      x: true,
      y: true,
      fid: t.fid || false,
      kapasiteet: t.kapasiteet || false,
    }));

    if (!canSubmit) {
      focusFirstError();
      setToast({
        open: true,
        severity: "error",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();
      await addStation(payload);

      // success toast at bottom on mobile / top on desktop
      setToast({
        open: true,
        severity: "success",
        message: "Station added successfully.",
      });

      // clear fields after success
      setStation(initialValue);
      setTouched({});
      // focus ID for quick next entry
      setTimeout(() => idRef.current?.focus?.(), 0);
    } catch (error) {
      setToast({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add station",
      });
      focusFirstError();
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setStation(initialValue);
    setTouched({});
    setTimeout(() => idRef.current?.focus?.(), 0);
  };

  return (
    <Box>
      <Header isSmDown={isSmDown} />

      <Paper sx={{ p: 2 }}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Grid container spacing={2}>
            {/* Row 1: IDs + primary name */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField
                label="FID"
                name="fid"
                value={station.fid}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.fid && !!errors.fid}
                helperText={touched.fid && errors.fid}
                fullWidth
                disabled={saving}
                slotProps={{
                  htmlInput: { inputMode: "numeric", pattern: "\\d*" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField
                inputRef={idRef}
                autoFocus
                required
                label="ID"
                name="id"
                value={station.id}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                fullWidth
                disabled={saving}
                slotProps={{
                  htmlInput: { inputMode: "numeric", pattern: "\\d*" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 6 }}>
              <TextField
                label="NIMI (fi)"
                name="nimi"
                value={station.nimi}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.nimi && !!errors.name}
                helperText={touched.nimi && errors.name}
                fullWidth
                disabled={saving}
              />
            </Grid>

            {/* Row 2: other names */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="NAMN (sv)"
                name="namn"
                value={station.namn}
                onChange={onValueChange}
                onBlur={markTouched}
                fullWidth
                disabled={saving}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="NAME (en)"
                name="name"
                value={station.name}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                fullWidth
                disabled={saving}
              />
            </Grid>

            {/* Row 3: addresses */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="OSOITE (fi)"
                name="osoite"
                value={station.osoite}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.osoite && !!errors.address}
                helperText={touched.osoite && errors.address}
                fullWidth
                disabled={saving}
                autoComplete="street-address"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="ADDRESS (en)"
                name="address"
                value={station.address}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                fullWidth
                disabled={saving}
                autoComplete="street-address"
              />
            </Grid>

            {/* Row 4: city / operator */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="KAUPUNKI (fi)"
                name="kaupunki"
                value={station.kaupunki}
                onChange={onValueChange}
                onBlur={markTouched}
                fullWidth
                disabled={saving}
                autoComplete="address-level2"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="STAD (sv)"
                name="stad"
                value={station.stad}
                onChange={onValueChange}
                onBlur={markTouched}
                fullWidth
                disabled={saving}
                autoComplete="address-level2"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="OPERAATTOR"
                name="operaattor"
                value={station.operaattor}
                onChange={onValueChange}
                onBlur={markTouched}
                fullWidth
                disabled={saving}
                autoComplete="organization"
              />
            </Grid>

            {/* Row 5: capacity + coords */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="KAPASITEET"
                name="kapasiteet"
                value={station.kapasiteet}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.kapasiteet && !!errors.kapasiteet}
                helperText={touched.kapasiteet && errors.kapasiteet}
                fullWidth
                disabled={saving}
                slotProps={{
                  htmlInput: { inputMode: "numeric", pattern: "\\d*" },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                label="LAT (y) *"
                name="y"
                value={station.y}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.y && !!errors.y}
                helperText={touched.y && errors.y}
                fullWidth
                disabled={saving}
                slotProps={{ htmlInput: { inputMode: "decimal" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                required
                label="LONG (x) *"
                name="x"
                value={station.x}
                onChange={onValueChange}
                onBlur={markTouched}
                error={touched.x && !!errors.x}
                helperText={touched.x && errors.x}
                fullWidth
                disabled={saving}
                slotProps={{ htmlInput: { inputMode: "decimal" } }}
              />
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 3 }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!canSubmit || saving}
            >
              {saving ? "Saving…" : "Add Station"}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Toast lives once per page; shows bottom on mobile */}
      <ToastMessage
        open={toast.open}
        severity={toast.severity}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
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
          variant={isSmDown ? "h6" : "h5"}
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Add Station
        </Typography>
      </Stack>
    </Stack>
  );
}

export default AddStation;
