import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MAX_PROGRESS = 92;
const COMPLETE_PROGRESS = 100;
const PROGRESS_INTERVAL = 280;
const START_PROGRESS = 6;

export function useProgressSimulation(messages = []) {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const message = useMemo(() => {
    if (messages.length === 0) {
      return "";
    }

    let currentMessage = messages[0].text;

    messages.forEach((item) => {
      if (progress >= item.at) {
        currentMessage = item.text;
      }
    });

    return currentMessage;
  }, [messages, progress]);

  const start = useCallback(() => {
    clearTimer();
    setProgress(START_PROGRESS);

    timerRef.current = window.setInterval(() => {
      setProgress((previousProgress) => {
        if (previousProgress >= MAX_PROGRESS) {
          return previousProgress;
        }

        const step =
          previousProgress < 35 ? 7 : previousProgress < 70 ? 4 : 2;

        return Math.min(MAX_PROGRESS, previousProgress + step);
      });
    }, PROGRESS_INTERVAL);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setProgress(0);
  }, [clearTimer]);

  const complete = useCallback(
    (onDone, delay = 400) => {
      clearTimer();
      setProgress(COMPLETE_PROGRESS);

      window.setTimeout(() => {
        onDone?.();
        setProgress(0);
      }, delay);
    },
    [clearTimer]
  );

  return { progress, message, start, reset, complete };
}
