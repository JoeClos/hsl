import {
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import DirectionsBikeOutlinedIcon from "@mui/icons-material/DirectionsBikeOutlined";
import PlaceIcon from "@mui/icons-material/Place";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

const Sidebar = ({
  isDesktop,
  open,
  setOpen,
  mobileOpen,
  setMobileOpen,
  expandedWidth,
  miniWidth,
}) => {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", label: "Map", icon: <MapIcon />, match: (p) => p === "/" },
    {
      to: "/journeys",
      label: "Journeys",
      icon: <DirectionsBikeOutlinedIcon />,
      match: (p) => p.startsWith("/journeys"),
    },
    {
      to: "/stations",
      label: "Stations",
      icon: <PlaceIcon />,
      match: (p) => p.startsWith("/stations"),
    }, // covers /stations/:id too
    {
      to: "/add",
      label: "Add Station",
      icon: <AddLocationAltIcon />,
      match: (p) => p.startsWith("/add"),
    },
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
        {navItems.map((item) => {
          const selected = item.match(pathname);
          return (
            <ListItem key={item.to} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={NavLink}
                to={item.to}
                onClick={() => !isDesktop && setMobileOpen(false)}
                selected={selected}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  "&.Mui-selected": { bgcolor: "action.selected" },
                  "&.Mui-selected:hover": { bgcolor: "action.selected" },
                }}
              >
                <Box
                  sx={{
                    mr: open ? 2 : 0,
                    display: "grid",
                    placeItems: "center",
                    color: selected ? "primary.main" : "inherit",
                  }}
                >
                  {item.icon}
                </Box>
                {open && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      color: selected ? "primary" : "inherit",
                      fontWeight: selected ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: open ? 2 : 1,
          fontSize: 12,
          color: "text.secondary",
          lineHeight: 1.5,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: "auto",
          textAlign: open ? "left" : "center",
        }}
      >
        {open ? (
          <>
            {/* Your name & copyright */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, mb: 1, color: "text.primary" }}
            >
              &copy; {new Date().getFullYear()} Josephine Closan
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              All Rights Reserved.
            </Typography>

            <Divider sx={{ my: 1 }} />

            {/* Credits */}
            <Typography variant="caption" component="div">
              Map: © OpenStreetMap contributors.
              <br />
              Marker: Lindsey.danielson, CC BY-SA 4.0.
            </Typography>
          </>
        ) : (
          <Box>
            <DirectionsBikeIcon fontSize="small" />
            <Typography variant="caption" display="block">
              JC
            </Typography>
          </Box>
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
      slotProps={{ tabIndex: -1 }}
      sx={{
        "& .MuiDrawer-paper": { width: expandedWidth, boxSizing: "border-box" },
      }}
    >
      {Content}
    </Drawer>
  );
};

export default Sidebar;
