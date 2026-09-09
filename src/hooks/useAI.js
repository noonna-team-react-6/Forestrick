import { useCallback, useRef, useState } from "react";
import { generateAI } from "../api/ai";

export function useAI(provider = "openai") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const generate = useCallback(
    async (prompt) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        return await generateAI(provider, prompt, { signal: controller.signal });
      } catch (err) {
        if (err.harness?.kind !== "cancelled") {
          setError(err);
        }
        throw err;
      } finally {
        if (controllerRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [provider]
  );

  return { generate, loading, error };
}
