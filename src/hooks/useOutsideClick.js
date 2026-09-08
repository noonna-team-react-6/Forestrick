import { useEffect, useRef } from "react";

/**
 * ref 바깥을 클릭하면 onOutsideClick을 실행합니다.
 * @param {import("react").RefObject<HTMLElement | null>} ref
 * @param {(event: MouseEvent | TouchEvent) => void} [onOutsideClick]
 * @param {boolean} [enabled]
 */
export default function useOutsideClick(ref, onOutsideClick, enabled = true) {
  const callbackRef = useRef(onOutsideClick);

  useEffect(() => {
    callbackRef.current = onOutsideClick;
  }, [onOutsideClick]);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event) => {
      const el = ref.current;
      if (!el || el.contains(event.target)) return;
      callbackRef.current?.(event);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [ref, enabled]);
}
