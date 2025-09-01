import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapIcon from "@mui/icons-material/Map";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import PlaceIcon from "@mui/icons-material/Place";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import MenuIcon from "@mui/icons-material/Menu";

const routes = ["/", "/journeys", "/stations", "/add"];

function deriveIndex(pathname) {
  if (pathname === "/") return 0;
  if (pathname.startsWith("/journeys")) return 1;
  if (pathname.startsWith("/stations")) return 2; // handles /stations and /stations/:id
  if (pathname.startsWith("/add")) return 3;
  return 0;
}

const BottomNavBar = ({ setMobileOpen }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(deriveIndex(pathname));
  }, [pathname]);

  return (
    <Paper
      data-bottom-nav
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: "block", sm: "none" },
        px: 0,
        pb: "env(safe-area-inset-bottom)",
        maxWidth: "100vw",
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => {
          if (newValue === "menu") {
            setMobileOpen(true);
            return;
          }
          navigate(routes[newValue] || "/");
        }}
        showLabels
      >
        <BottomNavigationAction label="Map" icon={<MapIcon />} />
        <BottomNavigationAction
          label="Journeys"
          icon={<DirectionsBikeOutlinedIcon />}
        />
        <BottomNavigationAction label="Stations" icon={<PlaceIcon />} />
        <BottomNavigationAction label="Add" icon={<AddLocationAltIcon />} />
        <BottomNavigationAction value="menu" label="Menu" icon={<MenuIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;
