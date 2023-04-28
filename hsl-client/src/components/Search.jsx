import { Paper, Divider, InputBase, IconButton } from "@mui/material";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";

const Search = ({ handleSearch }) => {
  return (
    <Paper
      component="form"
      elevation={3}
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <LocationSearchingOutlinedIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search station..."
        inputProps={{ "aria-label": "search station" }}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </Paper>
  );
};

export default Search;
