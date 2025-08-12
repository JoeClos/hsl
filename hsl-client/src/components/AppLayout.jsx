import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import BottomNavBar from "./BottomNavBar";

const DESKTOP_EXPANDED = 280;
const DESKTOP_MINI = 72;
const FULL_BLEED_PATHS = ["/"];

const AppLayout = () =>{
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { pathname } = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);  // desktop rail toggle
  const [mobileOpen, setMobileOpen] = useState(false);   // mobile drawer

  const isFullBleed = useMemo(() => FULL_BLEED_PATHS.includes(pathname), [pathname]);
  const sidebarWidth = isDesktop ? (sidebarOpen ? DESKTOP_EXPANDED : DESKTOP_MINI) : 0;

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
          height: "100vh",
          overflow: "auto",
          bgcolor: isFullBleed ? "transparent" : "background.default",
        }}
      >
        {isFullBleed ? (
          <Box sx={{ width: "100%", height: "100%" }}>
            <Outlet />
          </Box>
        ) : (
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Outlet />
          </Container>
        )}
      </Box>

      {!isDesktop && <BottomNavBar setMobileOpen={setMobileOpen} />}
    </Box>
  );
}

export default AppLayout;
