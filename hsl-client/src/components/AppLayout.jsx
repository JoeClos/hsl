import { useMemo, useState, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import BottomNavBar from "./BottomNavBar";
import { mobileBottomNavOffset } from "../theme";

const DESKTOP_EXPANDED = 280;
const DESKTOP_MINI = 72;
const FULL_BLEED_PATHS = ["/"];

const AppLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm")); // >= 600px
  const location = useLocation();
  const { pathname } = location;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll the main container to top on navigation (mobile only)
  useLayoutEffect(() => {
    if (isDesktop) return; // only mobile

    const el = document.getElementById("app-scroll");
    if (!el) return;

    // Wait for route content to mount & layout, then scroll
    // rAF twice is a common trick to ensure paint happened.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Instant jump first to be safe on iOS overflow containers
        el.scrollTop = 0;
        // Try smooth (ignored if unsupported)
        try {
          el.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          /* noop */
        }
      });
    });
  }, [
    isDesktop,
    // location.key changes on every navigation, even when pathname is the same
    location.key,
    // if you prefer being explicit, you can also include:
    // location.pathname, location.search, location.hash
  ]);

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
        component="main"
        id="app-scroll" // <-- the element we scroll
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          overflow: "auto",
          minHeight: 0,
          bgcolor: isFullBleed ? "transparent" : "background.default",
          display: "flex",
          flexDirection: "column",
          pb: mobileBottomNavOffset,
          // (Optional) helps iOS feel snappier
          WebkitOverflowScrolling: "touch",
        }}
      >
        {isFullBleed ? (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Outlet />
          </Box>
        ) : (
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
