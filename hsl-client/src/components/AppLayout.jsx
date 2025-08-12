import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import BottomNavBar from "./BottomNavBar";

const DESKTOP_EXPANDED = 280;
const DESKTOP_MINI = 72;
const FULL_BLEED_PATHS = ["/"];

const AppLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm")); //tablet and up
  const { pathname } = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop rail toggle
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  const isFullBleed = useMemo(
    () => FULL_BLEED_PATHS.includes(pathname),
    [pathname]
  );
  const sidebarWidth = isDesktop
    ? sidebarOpen
      ? DESKTOP_EXPANDED
      : DESKTOP_MINI
    : 0;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        isDesktop={isDesktop}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        expandedWidth={DESKTOP_EXPANDED}
        miniWidth={DESKTOP_MINI}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          // use dynamic viewport height + allow children to shrink
          height: { xs: "100dvh", md: "100vh" },
          overflow: "hidden",
          minHeight: 0,
          bgcolor: isFullBleed ? "transparent" : "background.default",
          display: "flex", // so inner wrapper can stretch
          flexDirection: "column",
        }}
      >
        {isFullBleed ? (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Outlet />
          </Box>
        ) : (
          // Avoid MUI <Container> for pages with maps; it doesn't manage height
          <Box sx={{ flex: 1, minHeight: 0, p: 2 }}>
            <Outlet />
          </Box>
        )}
      </Box>

      {!isDesktop && <BottomNavBar setMobileOpen={setMobileOpen} />}
    </Box>
  );
};

export default AppLayout;
