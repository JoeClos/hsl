import { NavLink } from "react-router-dom";
import { useState } from "react";
import Map from "./Map";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import Divider from "@mui/material/Divider";

const HomePage = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <DirectionsBikeIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              HCB
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem
                  onClick={handleCloseNavMenu}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Typography textAlign="center">
                    {" "}
                    <NavLink
                      to={`/journeys`}
                      style={{ textDecoration: "none" }}
                    >
                      Journeys
                    </NavLink>
                  </Typography>
                  <Typography textAlign="center">
                    {" "}
                    <NavLink
                      to={`/stations`}
                      style={{ textDecoration: "none" }}
                    >
                      Stations
                    </NavLink>
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            <DirectionsBikeIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              HCB
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                justifyContent: "flex-end",
                display: { xs: "none", md: "flex" },
              }}
            >
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <NavLink
                  to={`/journeys`}
                  className={(isActive) =>
                    "nav-link" + (!isActive ? " unselected" : "")
                  }
                >
                  Journeys
                </NavLink>
              </Button>
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <NavLink
                  to={`/stations`}
                  className={(isActive) =>
                    "nav-link" + (!isActive ? " unselected" : "")
                  }
                >
                  Stations
                </NavLink>
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          {/* Map */}
          <Map />
          {/* Footer */}
          <Typography>
            See source code:
            <Link
              href="https://github.com/JoeClos/hsl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon />
            </Link>
          </Typography>
          <Divider />
          <Typography>
            &copy; 2023 Josephine Closan. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};
export default HomePage;
