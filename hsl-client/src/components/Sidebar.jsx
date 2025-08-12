import {
  Drawer, Box, Divider, List, ListItem, ListItemButton, ListItemText,
  IconButton, Tooltip
} from "@mui/material";
import { NavLink } from "react-router-dom";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import PlaceIcon from "@mui/icons-material/Place";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

const Sidebar =  ({isDesktop, open, setOpen, mobileOpen, setMobileOpen, expandedWidth, miniWidth}) => {
  
  const navItems = [
    { to: "/", label: "Map", icon: <MapIcon /> },
    { to: "/journeys", label: "Journeys", icon: <DirectionsBikeOutlinedIcon /> },
    { to: "/stations", label: "Stations", icon: <PlaceIcon /> },
    { to: "/add", label: "Add Station", icon: <AddLocationAltIcon /> },
  ];

  const Content = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 1, gap: 1 }}>
        <DirectionsBikeIcon />
        {open && <Box sx={{ fontWeight: 700, flexGrow: 1 }}>HCB</Box>}
        {isDesktop ? (
          <Tooltip title={open ? "Collapse" : "Expand"}>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton size="small" onClick={() => setMobileOpen(false)}>
            <MenuOpenIcon />
          </IconButton>
        )}
      </Box>
      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={NavLink}
              to={item.to}
              onClick={() => !isDesktop && setMobileOpen(false)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <Box sx={{ mr: open ? 2 : 0, display: "grid", placeItems: "center" }}>
                {item.icon}
              </Box>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: open ? 2 : 1, fontSize: 12, color: "text.secondary" }}>
        {open ? (
          <>
            Map: © OpenStreetMap contributors. <br />
            Marker: Lindsey.danielson, CC BY-SA 4.0.
          </>
        ) : (
          <DirectionsBikeIcon fontSize="small" />
        )}
      </Box>
    </Box>
  );

  return isDesktop ? (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: open ? expandedWidth : miniWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? expandedWidth : miniWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
        },
      }}
    >
      {Content}
    </Drawer>
  ) : (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={() => setMobileOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: expandedWidth, boxSizing: "border-box" } }}
    >
      {Content}
    </Drawer>
  );
}

export default Sidebar;