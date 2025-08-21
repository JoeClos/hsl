import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapIcon from "@mui/icons-material/Map";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import PlaceIcon from "@mui/icons-material/Place";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import MenuIcon from "@mui/icons-material/Menu";

const BottomNavBar = ({ setMobileOpen }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const map = { "/": 0, "/journeys": 1, "/stations": 2, "/add": 3 };
    setValue(map[pathname] ?? 0);
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
          const paths = ["/", "/journeys", "/stations", "/add"];
          navigate(paths[newValue] || "/");
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
