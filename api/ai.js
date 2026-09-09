import OpenAI from "openai";

const OPENAI_MODEL =
  process.env.OPENAI_MODEL || "gpt-5.6-luna";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeTask = async (text) => {
  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "너는 한국어 업무 비서다. 사용자의 자연어 업무 요청을 구조화하라. 모르는 정보는 추측하지 말고 '확인 필요'라고 표시하라.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "task_analysis",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            taskType: { type: "string" },
            title: { type: "string" },
            date: { type: "string" },
            time: { type: "string" },
            location: { type: "string" },
            target: { type: "string" },
            summary: { type: "string" },
            actions: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "taskType",
            "title",
            "date",
            "time",
            "location",
            "target",
            "summary",
            "actions",
          ],
        },
      },
    },
  });

  return JSON.parse(response.output_text);
};

const createDocument = async (prompt) => {
  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "너는 한국 기업·기관의 실무 문서를 작성하는 AI 비서다. 사용자가 선택한 작업을 기준으로 자연스럽고 간결한 한국어 업무 안내 문서를 작성하라. 확인되지 않은 사실을 만들지 말라.",
      },
      {
        role: "user",
        content: JSON.stringify(prompt),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "generated_document",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            to: { type: "string" },
            subject: { type: "string" },
            greeting: { type: "string" },
            paragraphs: {
              type: "array",
              items: { type: "string" },
            },
            closing: { type: "string" },
            signature: { type: "string" },
          },
          required: [
            "title",
            "to",
            "subject",
            "greeting",
            "paragraphs",
            "closing",
            "signature",
          ],
        },
      },
    },
  });

  return JSON.parse(response.output_text);
};

const handler = async (request, response) => {
  if (request.method !== "POST") {
    return response
      .status(405)
      .json({ message: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(500).json({
      message: "OPENAI_API_KEY가 설정되지 않았습니다.",
    });
  }

  try {
    const { provider, prompt } = request.body || {};

    if (provider !== "openai") {
      return response.status(400).json({
        message: "현재 지원하지 않는 AI provider입니다.",
      });
    }

    if (prompt?.type === "analyze") {
      const result = await analyzeTask(prompt.text);
      return response.status(200).json(result);
    }

    if (prompt?.type === "generate") {
      const result = await createDocument(prompt);
      return response.status(200).json(result);
    }

    return response.status(400).json({
      message: "지원하지 않는 요청 유형입니다.",
    });
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      message: "AI 처리 중 오류가 발생했습니다.",
      detail: error?.message,
    });
  }
};

export default handler;
