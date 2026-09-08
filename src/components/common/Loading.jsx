import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

const COLOR = "#3B7BFF";

const CIRCLE_SIZES = {
  sm: 24,
  md: 40,
  lg: 56,
};

const BAR_SIZES = {
  sm: 4,
  md: 6,
  lg: 8,
};

/**
 * @param {object} [props]
 * @param {"circular" | "linear"} [props.variant]
 * @param {"sm" | "md" | "lg"} [props.size]
 * @param {number} [props.value]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children]
 * @param {import("@mui/material").SxProps} [props.sx]
 */
export default function Loading({
  variant = "circular",
  size = "md",
  value,
  className,
  children,
  sx,
}) {
  const isDeterminate = typeof value === "number";
  const circleSize = CIRCLE_SIZES[size] ?? CIRCLE_SIZES.md;
  const barHeight = BAR_SIZES[size] ?? BAR_SIZES.md;

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: variant === "linear" ? "stretch" : "center",
        gap: 1,
        width: variant === "linear" ? "100%" : "auto",
        ...sx,
      }}
    >
      {variant === "linear" ? (
        <LinearProgress
          variant={isDeterminate ? "determinate" : "indeterminate"}
          value={isDeterminate ? value : undefined}
          sx={{
            height: barHeight,
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              backgroundColor: COLOR,
            },
          }}
        />
      ) : (
        <CircularProgress
          variant={isDeterminate ? "determinate" : "indeterminate"}
          value={isDeterminate ? value : undefined}
          size={circleSize}
          thickness={4}
          sx={{ color: COLOR }}
        />
      )}
      {children ? (
        <Box sx={{ color: "#9CA3AF", fontSize: 13, textAlign: "center" }}>
          {children}
        </Box>
      ) : null}
    </Box>
  );
}
