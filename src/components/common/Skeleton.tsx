import MuiSkeleton from "@mui/material/Skeleton";

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  variant?: "text" | "rectangular" | "rounded" | "circular";
};

export default function Skeleton({
  width,
  height = 16,
  className,
  variant = "rounded",
  ...props
}: SkeletonProps) {
  return (
    <MuiSkeleton
      className={className}
      variant={variant}
      width={width}
      height={height}
      animation="wave"
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.08)",
        "&::after": {
          background:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)",
        },
      }}
      {...props}
    />
  );
}
