import { Snackbar, Alert, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/**
 * Reusable toast message.
 * - Shows at the bottom on mobile, top on larger screens.
 * - severity: "success" | "error" | "warning" | "info"
 */
const ToastMessage = ({
  open,
  onClose,
  message,
  severity = "info",
  autoHideDuration = 4000,
}) =>{
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{
        vertical: isSmDown ? "bottom" : "top",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default ToastMessage;