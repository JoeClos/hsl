import { useRef, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import BottomNavBar from "./BottomNavBar";
import { mobileBottomNavOffset } from "../theme";
import ScrollToTopButton from "./ScrollToTopButton";

const DESKTOP_EXPANDED = 280;
const DESKTOP_MINI = 72;
const FULL_BLEED_PATHS = ["/"];

const AppLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const location = useLocation();
  const { pathname } = location;
  const mainRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isFullBleed = useMemo(
    () => FULL_BLEED_PATHS.includes(pathname),
    [pathname]
  );

  const sidebarWidth = isDesktop
    ? sidebarOpen
      ? DESKTOP_EXPANDED
      : DESKTOP_MINI
    : 0;

  // Scroll to top whenever pathname changes (mobile only)
  useEffect(() => {
    if (!isDesktop && mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname, isDesktop]);

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
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
         data-app-main
        ref={mainRef}
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          overflow: "auto",
          minHeight: 0,
          bgcolor: isFullBleed ? "transparent" : "background.default",
          display: "flex",
          flexDirection: "column",
          WebkitOverflowScrolling: "touch",
          overflowAnchor: "none",
          position: "relative",
          // Modified height and padding approach
          height: {
            xs: `calc(100dvh - ${mobileBottomNavOffset.xs})`,
            sm: "auto",
          },
          pb: { xs: `calc(${mobileBottomNavOffset.xs} + 16px)`, sm: 0 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            pb: { xs: 2, sm: 0 }, // Additional content padding
          }}
        >
          {isFullBleed ? (
            <Box key={location.key} sx={{ height: "100%" }}>
              <Outlet />
            </Box>
          ) : (
            <Box key={location.key} sx={{ height: "100%", p: 2 }}>
              <Outlet />
            </Box>
          )}
        </Box>
        <ScrollToTopButton scrollContainer={mainRef} />
      </Box>

      {!isDesktop && <BottomNavBar setMobileOpen={setMobileOpen} />}
    </Box>
  );
};

export default AppLayout;
