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
    // OpenAI 채팅 완성 API는 PDF 등 문서 파일을 직접 첨부해서 읽을 수 없음
    supportsFile: false,
  },
  gemini: {
    url: (apiKey) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    headers: () => ({}),
    body: (prompt, file) => ({
      contents: [
        {
          parts: file
            ? [
                { inlineData: { mimeType: file.mimeType, data: file.base64 } },
                { text: prompt },
              ]
            : [{ text: prompt }],
        },
      ],
    }),
    parse: (data) => data.candidates[0].content.parts[0].text,
    supportsFile: true,
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
    body: (prompt, file) => ({
      model: "claude-sonnet-5",
      // 첨부 문서가 길면 요약 응답도 길어져서 1024로는 중간에 끊길 수 있음
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: file
            ? [
                {
                  type: "document",
                  source: {
                    type: "base64",
                    media_type: file.mimeType,
                    data: file.base64,
                  },
                },
                { type: "text", text: prompt },
              ]
            : prompt,
        },
      ],
    }),
    // claude-sonnet-5는 복잡한 요청에서 thinking 블록을 text 블록보다 먼저 반환할 수 있어
    // 인덱스로 고정하지 않고 type이 "text"인 블록을 찾아야 함
    parse: (data) => data.content.find((block) => block.type === "text")?.text,
    supportsFile: true,
  },
};

export async function generateAI(provider, prompt, { signal, file } = {}) {
  const config = PROVIDERS[provider];

  if (!config) {
    throw new Error(`지원하지 않는 AI provider입니다: ${provider}`);
  }

  if (!config.apiKey) {
    throw new Error(
      `${provider} API 키가 설정되지 않았습니다. .env 파일을 확인하세요.`,
    );
  }

  if (file && !config.supportsFile) {
    throw new Error(
      `${provider}는 문서 파일 첨부를 지원하지 않습니다. Claude 또는 Gemini를 선택해 주세요.`,
    );
  }

  const url =
    typeof config.url === "function" ? config.url(config.apiKey) : config.url;

  const data = await withHarness(
    provider,
    (harnessSignal) =>
      axios
        .post(url, config.body(prompt, file), {
          headers: {
            "Content-Type": "application/json",
            ...config.headers(config.apiKey),
          },
          signal: harnessSignal,
        })
        .then((res) => res.data),
    { signal },
  );

  return config.parse(data);
}
