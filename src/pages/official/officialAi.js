import { DOCUMENT_TYPES, TONES } from "./Mock";

const TONE_LABEL = Object.fromEntries(TONES.map((tone) => [tone.id, tone.label]));

function fieldSchema() {
  return DOCUMENT_TYPES.map((type) => ({
    id: type.id,
    label: type.label,
    fields: type.fields.map((field) => field.key).concat(["department", "signerName"]),
  }));
}

export function buildExtractPrompt({ prompt, tone, companyStyle, showSignature }) {
  return [
    "당신은 한국어 공문 작성 도우미입니다.",
    "아래 사용자 요청에서 문서 정보를 추출하고 본문을 작성하세요.",
    "반드시 JSON만 출력하세요. 설명, 마크다운, 코드펜스는 넣지 마세요.",
    `문체: ${TONE_LABEL[tone] ?? "정중하게"} (${tone})`,
    companyStyle
      ? "우리 회사 공문 스타일: 간결한 헤더, 부서명과 서명란을 반영하세요."
      : "",
    showSignature ? "서명(부서명, 이름)을 fields에 포함하세요." : "",
    `가능한 documentType: ${DOCUMENT_TYPES.map((item) => item.id).join(", ")}`,
    `필드 스키마: ${JSON.stringify(fieldSchema())}`,
    "응답 형식:",
    JSON.stringify({
      documentType: "obituary",
      fields: {
        deceasedName: "",
        relationship: "",
        funeralHome: "",
        funeralDate: "",
        extra: "",
        department: "",
        signerName: "",
      },
      body: "본문",
      tone,
    }),
    "사용자 요청:",
    prompt,
  ]
    .filter(Boolean)
    .join("\n");
}

export function inferTypeFromPrompt(prompt) {
  const text = String(prompt ?? "");
  if (/별세|부고|발인|빈소|고인/.test(text)) return "obituary";
  if (/결혼|청첩|예식|신랑|신부/.test(text)) return "wedding";
  if (/위문|병가|쾌유/.test(text)) return "consolation";
  if (/감사/.test(text)) return "thanks";
  if (/일정\s*변경|일정변경/.test(text)) return "schedule";
  if (/행사|공유회/.test(text)) return "event";
  return DOCUMENT_TYPES[0].id;
}

export function buildRegisterPrompt({ prompt, showSignature }) {
  return [
    "당신은 한국어 공문 정보 추출기입니다.",
    "사용자 요청에서 문서 종류와 폼 필드를 추출하고, 그 정보로 공문 본문도 작성하세요.",
    "반드시 JSON만 출력하세요. 설명, 마크다운, 코드펜스는 넣지 마세요.",
    `가능한 documentType: ${DOCUMENT_TYPES.map((item) => item.id).join(", ")}`,
    `필드 스키마: ${JSON.stringify(fieldSchema())}`,
    "해당 documentType의 필드만 fields에 채우세요. 알 수 없는 값은 빈 문자열로 두세요.",
    showSignature ? "부서명과 이름이 있으면 fields에 포함하세요." : "",
    "응답 형식:",
    JSON.stringify({
      documentType: "obituary",
      fields: {
        deceasedName: "",
        relationship: "",
        funeralHome: "",
        funeralDate: "",
        extra: "",
        department: "",
        signerName: "",
      },
      body: "본문",
    }),
    "사용자 요청:",
    prompt,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildRewritePrompt({ body, tone }) {
  return [
    "다음 공문 본문의 의미는 유지하고 문체만 바꾸세요.",
    "반드시 JSON만 출력하세요. 설명, 마크다운, 코드펜스는 넣지 마세요.",
    `목표 문체: ${TONE_LABEL[tone] ?? tone} (${tone})`,
    '응답 형식: {"body":"재작성된 본문"}',
    "본문:",
    body,
  ].join("\n");
}

export function parseAIJson(text) {
  const trimmed = String(text ?? "").trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1].trim() : trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI 응답에서 JSON을 찾지 못했습니다.");
  }

  return JSON.parse(raw.slice(start, end + 1));
}
