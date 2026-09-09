import { useCallback, useState } from "react";
import { generateAI } from "../api/ai";
import { generateMockAI } from "../api/aiMock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_AI !== "false";

export function useAI(provider = "openai") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(
    async (prompt) => {
      setLoading(true);
      setError(null);

      try {
        if (USE_MOCK) {
          return await generateMockAI(prompt);
        }

        return await generateAI(provider, prompt);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [provider]
  );

  return { generate, loading, error };
}