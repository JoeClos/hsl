// import { useMemo, useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import { Box, useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import Sidebar from "./Sidebar";
// import BottomNavBar from "./BottomNavBar";

// const DESKTOP_EXPANDED = 280;
// const DESKTOP_MINI = 72;
// const FULL_BLEED_PATHS = ["/"];
// const BOTTOM_NAV_H = 56;

// const AppLayout = () => {
//   const theme = useTheme();
//   const isDesktop = useMediaQuery(theme.breakpoints.up("sm")); //tablet and up
//   const { pathname } = useLocation();

//   const [sidebarOpen, setSidebarOpen] = useState(true); // desktop rail toggle
//   const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

//   const isFullBleed = useMemo(
//     () => FULL_BLEED_PATHS.includes(pathname),
//     [pathname]
//   );
//   const sidebarWidth = isDesktop
//     ? sidebarOpen
//       ? DESKTOP_EXPANDED
//       : DESKTOP_MINI
//     : 0;

//   return (
//     <Box sx={{ display: "flex", minHeight: "100dvh" }}>
//       <Sidebar
//         isDesktop={isDesktop}
//         open={sidebarOpen}
//         setOpen={setSidebarOpen}
//         mobileOpen={mobileOpen}
//         setMobileOpen={setMobileOpen}
//         expandedWidth={DESKTOP_EXPANDED}
//         miniWidth={DESKTOP_MINI}
//       />

//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           width: { md: `calc(100% - ${sidebarWidth}px)` },
//           // use dynamic viewport height + allow children to shrink
//           height: { xs: "100dvh", md: "100vh" },
//           overflow: "auto",
//           minHeight: 0,
//           bgcolor: isFullBleed ? "transparent" : "background.default",
//           display: "flex", // so inner wrapper can stretch
//           flexDirection: "column",
//           pb: {
//             xs: `calc(${BOTTOM_NAV_H}px + env(safe-area-inset-bottom) + 12px)`,
//             sm: 0,
//           },
//         }}
//       >
//         {isFullBleed ? (
//           <Box sx={{ flex: 1, minHeight: 0 }}>
//             <Outlet />
//           </Box>
//         ) : (
//           // Avoid MUI <Container> for pages with maps; it doesn't manage height
//           <Box sx={{ flex: 1, minHeight: 0, p: 2 }}>
//             <Outlet />
//           </Box>
//         )}
//       </Box>

//       {!isDesktop && <BottomNavBar setMobileOpen={setMobileOpen} />}
//     </Box>
//   );
// };

// export default AppLayout;

import { useMemo, useState } from "react";
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100dvh", // dynamic viewport height for mobile
      }}
    >
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
          overflow: "auto",
          minHeight: 0,
          bgcolor: isFullBleed ? "transparent" : "background.default",
          display: "flex",
          flexDirection: "column",
          pb: mobileBottomNavOffset, // <-- consistent bottom padding everywhere
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
