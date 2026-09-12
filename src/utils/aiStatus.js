const PROVIDER_KEY_NAMES = {
  openai: "VITE_OPENAI_API_KEY",
  gemini: "VITE_GEMINI_API_KEY",
  claude: "VITE_CLAUDE_API_KEY",
};

const isMockMode = import.meta.env.VITE_USE_MOCK_AI !== "false";

export function getAIStatus(
  provider = import.meta.env.VITE_AI_PROVIDER || "gemini",
) {
  if (isMockMode) return "mock";

  const keyName = PROVIDER_KEY_NAMES[provider];
  const apiKey = keyName ? import.meta.env[keyName] : "";

  return apiKey?.trim() ? "ready" : "unavailable";
}
