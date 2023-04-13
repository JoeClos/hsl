// const HomePage = () => {
//   return (
//     <div>
//       <navbar style={{ display: "flex" }}>
//         <DirectionsBikeIcon style={{ fontSize: "2rem" }} />
//         <h4>Wellcome to Helsinki City Bikes</h4>
//       </navbar>
//       <Link to={`/journeys`}>Journeys</Link>
//       <Link to={`/stations`}>Stations</Link>
//     </div>
//   );
// };

import { NavLink } from "react-router-dom";
import { useState } from "react";
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


const HomePage = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
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
              <MenuItem onClick={handleCloseNavMenu} sx={{display: "flex", flexDirection: "column"}}>
                <Typography textAlign="center">
                  {" "}
                  <NavLink to={`/journeys`} style={{textDecoration: "none"}}>Journeys</NavLink>
                </Typography>
                <Typography textAlign="center">
                  {" "}
                  <NavLink to={`/stations`} style={{textDecoration: "none"}}>Stations</NavLink>
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
          <Box sx={{ flexGrow: 1, justifyContent: "flex-end", display: { xs: "none", md: "flex"}}}>
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
              <Button onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}>
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
  );
};
export default HomePage;
