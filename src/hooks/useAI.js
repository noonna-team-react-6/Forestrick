import { useCallback, useRef, useState } from "react";
import { generateAI } from "../api/ai";
import { generateMockAI } from "../api/aiMock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AI !== "false";

export function useAI(provider = "openai") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastMeta, setLastMeta] = useState(null);
  const controllerRef = useRef(null);

  const generate = useCallback(
    async (prompt, { file } = {}) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        if (USE_MOCK) {
          const startedAt = performance.now();
          const text = await generateMockAI(prompt);

          setLastMeta({
            provider: "mock",
            attempt: 0,
            latencyMs: performance.now() - startedAt,
          });

          return text;
        }

        const { text, meta } = await generateAI(provider, prompt, {
          signal: controller.signal,
          file,
        });

        setLastMeta(meta);
        return text;
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
    [provider],
  );

  return { generate, loading, error, lastMeta };
}
