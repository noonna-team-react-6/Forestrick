import { useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import { IconX } from "./Icons";
import useOutsideClick from "../../hooks/useOutsideClick";

const WIDTHS = {
  small: 360,
  medium: 520,
  large: 760,
};

/**
 * @param {object} [props]
 * @param {boolean} [props.open]
 * @param {"loading" | "default"} [props.type]
 * @param {boolean} [props.closeIcon]
 * @param {"small" | "medium" | "large"} [props.width]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children]
 * @param {() => void} [props.onClose]
 */
export default function ModalFrame({
  open = true,
  type = "default",
  closeIcon = false,
  width = "medium",
  className,
  children,
  onClose,
}) {
  const frameRef = useRef(null);
  const isLoading = type === "loading";
  const canClose = !isLoading;
  const frameWidth = WIDTHS[width] ?? WIDTHS.medium;

  useOutsideClick(frameRef, onClose, open && canClose);

  return (
    <Modal open={open} disableEscapeKeyDown={isLoading}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          outline: "none",
        }}
      >
        <Box
          ref={frameRef}
          tabIndex={-1}
          className={className}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: frameWidth,
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: "20px",
            backgroundColor: "#1A1F2B",
            color: "#fff",
            p: 3,
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
            outline: "none",
          }}
        >
          {canClose && closeIcon ? (
            <IconButton
              aria-label="닫기"
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 1,
                width: 32,
                height: 32,
                color: "#E5E7EB",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                },
              }}
            >
              <IconX size={16} />
            </IconButton>
          ) : null}
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
