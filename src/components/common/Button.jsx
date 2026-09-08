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
    "&.Mui-disabled": {
      color: "#fff",
      borderColor: "rgba(255, 255, 255, 0.16)",
      opacity: 0.4,
    },
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
 * @param {"primary" | "outline"} [props.variant]
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
        ...sizeSx,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
