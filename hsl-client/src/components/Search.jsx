import { useEffect, useRef, useState } from "react";
import { Paper, Divider, InputBase, IconButton } from "@mui/material";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
import ClearIcon from "@mui/icons-material/Clear";
const Search = ({
  onSearch, // (query: string) => void
  defaultValue = "",
  delay = 300, // debounce ms
  placeholder = "Search station…",
  enableSlashShortcut = true,
}) => {
  const [query, setQuery] = useState(defaultValue);
  const inputRef = useRef(null);

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => onSearch?.(query.trim()), delay);
    return () => clearTimeout(id);
  }, [query, delay, onSearch]);

  // Submit -> fire immediately (no debounce)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  // "/" focuses, "Escape" clears
  useEffect(() => {
    if (!enableSlashShortcut) return;
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      const typingInField = tag === "input" || tag === "textarea";
      if (!typingInField && e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (typingInField && e.key === "Escape") {
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enableSlashShortcut]);

  return (
    <Paper
      component="form"
      elevation={3}
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: "100%", sm: 360, md: 420 },
        px: 1,
        py: 0.5,
        borderRadius: 2,
        autoComplete: "off",
      }}
    >
      <IconButton aria-label="focus search" edge="start" sx={{ mr: 0.5 }}>
        <LocationSearchingOutlinedIcon />
      </IconButton>

      <Divider orientation="vertical" sx={{ height: 28, mx: 0.5 }} />

      <InputBase
        inputRef={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        sx={{ ml: 1, flex: 1 }}
        slotProps={{
          input: {
            "aria-label": "search station",
            autoComplete: "off",
          },
        }}
      />

      {query && (
        <IconButton
          aria-label="clear search"
          onClick={() => {
            setQuery("");
            onSearch?.("");
            inputRef.current?.focus();
          }}
          edge="end"
        >
          <ClearIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default Search;
