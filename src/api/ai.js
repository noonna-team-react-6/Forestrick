import axios from "axios";
import { withHarness } from "./harness";

const PROVIDERS = {
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (prompt) => ({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
    parse: (data) => data.choices[0].message.content,
  },
  gemini: {
    url: (apiKey) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    headers: () => ({}),
    body: (prompt) => ({
      contents: [{ parts: [{ text: prompt }] }],
    }),
    parse: (data) => data.candidates[0].content.parts[0].text,
  },
  claude: {
    url: "https://api.anthropic.com/v1/messages",
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    // Anthropic API는 기본적으로 브라우저 요청을 CORS로 막기 때문에 이 헤더가 필요합니다.
    headers: (apiKey) => ({
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    }),
    body: (prompt) => ({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
    parse: (data) => data.content[0].text,
  },
};

export async function generateAI(provider, prompt, { signal } = {}) {
  const config = PROVIDERS[provider];

  if (!config) {
    throw new Error(`지원하지 않는 AI provider입니다: ${provider}`);
  }

  if (!config.apiKey) {
    throw new Error(
      `${provider} API 키가 설정되지 않았습니다. .env 파일을 확인하세요.`
    );
  }

  const url = typeof config.url === "function" ? config.url(config.apiKey) : config.url;

  const data = await withHarness(
    provider,
    (harnessSignal) =>
      axios
        .post(url, config.body(prompt), {
          headers: {
            "Content-Type": "application/json",
            ...config.headers(config.apiKey),
          },
          signal: harnessSignal,
        })
        .then((res) => res.data),
    { signal }
  );

  return config.parse(data);
}
