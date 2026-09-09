import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: "OPENAI_API_KEY가 설정되지 않았습니다." });
  }

  try {
    const { type } = req.body || {};

    if (type === "analyze") {
      const { text } = req.body;

      const response = await client.responses.create({
        model: MODEL,
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
                  items: { type: "string" }
                }
              },
              required: ["taskType","title","date","time","location","target","summary","actions"]
            }
          }
        }
      });

      return res.status(200).json(JSON.parse(response.output_text));
    }

    if (type === "generate") {
      const { originalRequest, analysis, selectedActions } = req.body;

      const response = await client.responses.create({
        model: MODEL,
        input: [
          {
            role: "system",
            content:
              "너는 한국 기업·기관의 실무 문서를 작성하는 AI 비서다. 사용자가 선택한 작업을 기준으로 자연스럽고 간결한 한국어 업무 안내 문서를 작성하라. 확인되지 않은 사실을 만들지 말라."
          },
          {
            role: "user",
            content: JSON.stringify({ originalRequest, analysis, selectedActions })
          }
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
                  items: { type: "string" }
                },
                closing: { type: "string" },
                signature: { type: "string" }
              },
              required: ["title","to","subject","greeting","paragraphs","closing","signature"]
            }
          }
        }
      });

      return res.status(200).json(JSON.parse(response.output_text));
    }

    return res.status(400).json({ message: "지원하지 않는 요청 유형입니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "AI 처리 중 오류가 발생했습니다.",
      detail: error?.message
    });
  }
}
