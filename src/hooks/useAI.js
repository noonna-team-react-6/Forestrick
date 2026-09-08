import { useCallback, useState } from "react";
import { generateAI } from "../api/ai";

export function useAI(provider = "openai") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(
    async (prompt) => {
      setLoading(true);
      setError(null);

      try {
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
