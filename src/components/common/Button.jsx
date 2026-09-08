import MuiButton from "@mui/material/Button";

// 색상 수정
const VARIANTS = {
  primary: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "1px solid transparent",
    "&:hover": {
      backgroundColor: "#2563EB",
    },
    "&:active": {
      backgroundColor: "#1D4ED8",
      transform: "scale(0.98)",
    },
    "&.Mui-disabled": {
      backgroundColor: "#3B82F6",
      color: "#fff",
      opacity: 0.4,
    },
  },
  outline: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.22)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.35)",
    },
    "&:active": {
      backgroundColor: "rgba(255, 255, 255, 0.14)",
      transform: "scale(0.98)",
    },
    "&.Mui-disabled": {
      color: "#fff",
      borderColor: "rgba(255, 255, 255, 0.16)",
      opacity: 0.4,
    },
  },
  gradient: {
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(180deg, #5BA3FF 0%, #3B7BFF 48%, #2E5BFF 100%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    color: "#fff",
    border: 0,
    boxShadow: "none",
    filter: "drop-shadow(0 6px 14px rgba(47, 91, 255, 0.45))",
    "&:hover": {
      backgroundImage: "linear-gradient(180deg, #6BB0FF 0%, #3B7BFF 50%, #2550F0 100%)",
      boxShadow: "none",
      filter: "drop-shadow(0 8px 16px rgba(47, 91, 255, 0.55))",
    },
    "&:active": {
      backgroundImage: "linear-gradient(180deg, #3B7BFF 0%, #2E5BFF 50%, #1D4ED8 100%)",
      boxShadow: "none",
      filter: "drop-shadow(0 4px 10px rgba(47, 91, 255, 0.35))",
      transform: "scale(0.98)",
    },
    "&.Mui-disabled": {
      backgroundImage: "linear-gradient(180deg, #5BA3FF 0%, #3B7BFF 48%, #2E5BFF 100%)",
      color: "#fff",
      opacity: 0.4,
      boxShadow: "none",
      filter: "none",
    },
  },
};

const SELECTED = {
  primary: {
    backgroundColor: "#2563EB",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#1D4ED8",
    },
    "&:active": {
      backgroundColor: "#1E40AF",
    },
  },
  outline: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "1px solid transparent",
    "&:hover": {
      backgroundColor: "#2563EB",
      borderColor: "transparent",
    },
    "&:active": {
      backgroundColor: "#1D4ED8",
    },
  },
  gradient: {
    filter: "brightness(1.05) drop-shadow(0 6px 14px rgba(47, 91, 255, 0.5))",
  },
};

const SIZES = {
  sm: {
    fontSize: 13,
    fontWeight: 600,
    minHeight: 32,
    px: 1.75,
    py: 0.5,
  },
  md: {
    fontSize: 14,
    fontWeight: 600,
    minHeight: 40,
    px: 2.25,
    py: 0.75,
  },
  lg: {
    fontSize: 16,
    fontWeight: 600,
    minHeight: 48,
    px: 2.75,
    py: 1,
  },
};

/**
 * @param {object} [props]
 * @param {"primary" | "outline" | "gradient"} [props.variant]
 * @param {boolean} [props.selected]
 * @param {"sm" | "md" | "lg"} [props.size]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children]
 * @param {import("react").MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {boolean} [props.disabled]
 * @param {import("react").ButtonHTMLAttributes<HTMLButtonElement>["type"]} [props.type]
 * @param {import("@mui/material").SxProps} [props.sx]
 */
export default function Button({
  variant = "primary",
  selected = false,
  size = "md",
  className,
  children,
  onClick,
  disabled = false,
  type = "button",
  sx,
  ...props
}) {
  const variantSx = VARIANTS[variant] ?? VARIANTS.primary;
  const selectedSx = selected ? (SELECTED[variant] ?? SELECTED.primary) : null;
  const sizeSx = SIZES[size] ?? SIZES.md;

  return (
    <MuiButton
      disableElevation
      disableRipple={false}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      sx={{
        textTransform: "none",
        borderRadius: 999,
        letterSpacing: 0,
        lineHeight: 1.2,
        minWidth: 0,
        boxShadow: "none",
        gap: 0.75,
        ...variantSx,
        ...selectedSx,
        ...sizeSx,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
