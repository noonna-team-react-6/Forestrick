import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const TYPES = {
  default: {
    backgroundColor: "#1A1F2B",
    color: "#F9FAFB",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  success: {
    backgroundColor: "#064E3B",
    color: "#D1FAE5",
    border: "1px solid rgba(52, 211, 153, 0.35)",
  },
  error: {
    backgroundColor: "#7F1D1D",
    color: "#FECACA",
    border: "1px solid rgba(248, 113, 113, 0.4)",
  },
};

const SEVERITY = {
  default: "info",
  success: "success",
  error: "error",
};

/**
 * @param {object} [props]
 * @param {boolean} [props.open]
 * @param {"default" | "success" | "error"} [props.type]
 * @param {string} [props.message]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children]
 * @param {() => void} [props.onClose]
 * @param {number} [props.autoHideDuration]
 */
export default function Toast({
  open = false,
  type = "default",
  message,
  className,
  children,
  onClose,
  autoHideDuration = 3000,
  ...props
}) {
  const typeSx = TYPES[type] ?? TYPES.default;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    onClose?.(event, reason);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      slotProps={{
        clickAwayListener: {
          mouseEvent: false,
          touchEvent: false,
        },
      }}
      sx={{
        pointerEvents: "none",
        "& .MuiAlert-root": { pointerEvents: "auto" },
      }}
      {...props}
    >
      <Alert
        className={className}
        elevation={0}
        variant="filled"
        severity={SEVERITY[type] ?? "info"}
        onClose={handleClose}
        sx={{
          minWidth: 280,
          borderRadius: 999,
          alignItems: "center",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
          "& .MuiAlert-icon": { color: "inherit" },
          "& .MuiAlert-action": { color: "inherit", pt: 0 },
          ...typeSx,
        }}
      >
        {message ?? children}
      </Alert>
    </Snackbar>
  );
}

export function Error(props) {
  return <Toast type="error" {...props} />;
}
