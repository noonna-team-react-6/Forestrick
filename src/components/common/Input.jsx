import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

const WIDTHS = {
  full: { width: "100%" },
  short: { width: 200 },
  medium: { width: 320 },
  wide: { width: 480 },
};

/**
 * @param {object} [props]
 * @param {"full" | "short" | "medium" | "wide"} [props.width]
 * @param {string} [props.placeholder]
 * @param {string} [props.label]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children]
 * @param {import("@mui/material").SxProps} [props.sx]
 */
export default function Input({
  width = "medium",
  placeholder,
  label,
  className,
  children,
  sx,
  ...props
}) {
  const widthSx = WIDTHS[width] ?? WIDTHS.medium;

  return (
    <Box className={className} sx={widthSx}>
      {label ? (
        <Box
          component="label"
          sx={{
            display: "block",
            mb: 0.75,
            ml: 0.5,
            fontSize: 13,
            fontWeight: 500,
            color: "#9CA3AF",
          }}
        >
          {label}
        </Box>
      ) : null}
      <TextField
        fullWidth
        hiddenLabel
        placeholder={placeholder}
        slotProps={{
          input: {
            startAdornment: children ? (
              <InputAdornment position="start">{children}</InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 999,
            backgroundColor: "#11161D",
            color: "#E5E7EB",
            minHeight: 40,
            fontSize: 14,
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.12)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(59, 130, 246, 0.55)",
            },
          },
          "& .MuiInputBase-input": {
            py: 1.15,
            "&::placeholder": {
              color: "#6B7280",
              opacity: 1,
            },
          },
          "& .MuiInputAdornment-root": {
            color: "#6B7280",
            mr: 0.5,
          },
          ...sx,
        }}
        {...props}
      />
    </Box>
  );
}
