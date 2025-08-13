import { createTheme } from "@mui/material/styles";

export const mobileBottomNavOffset = {
  xs: `calc(56px + env(safe-area-inset-bottom) + 12px)`, 
  sm: 0,
};

const theme = createTheme({
  palette: {
    primary: { main: "#1565C0" },
    background: { default: "#f9f9f9" },
  },
  shape: { borderRadius: 12 },
});

export default theme;
