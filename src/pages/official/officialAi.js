import { DOCUMENT_TYPES, TONES } from "../../data/official";

const TONE_LABEL = Object.fromEntries(
  TONES.map((tone) => [tone.id, tone.label]),
);

function fieldSchema() {
  return DOCUMENT_TYPES.map((type) => ({
    id: type.id,
    label: type.label,
    fields: type.fields
      .filter((field) => field.type !== "image")
      .map((field) => field.key)
      .concat(["department", "signerName"]),
  }));
}

const BODY_AND_EXTRA_RULES = [
  "본문(body)에는 안내 문장을 쓰세요. 사용자 요청의 핵심 대상(누구, 관계, 무엇을 알리는지)은 본문 문장 안에 자연스럽게 넣으세요.",
  "일시, 장소처럼 전용 필드가 있는 항목은 fields에 넣고, 본문에 '- 다음 -', '1. 일시', '2. 장소' 같은 목록을 만들지 마세요.",
  "fields.extra는 모든 문서에서 쓰는 추가 내용입니다. 사용자 요청의 요구사항과 해당 문서 맥락에 맞는 부가 안내를 작성하세요. 목록이나 이름을 넣어도 됩니다.",
  "핵심 사실을 extra에만 몰아넣지 마세요. extra에 쓸 부가 내용이 없으면 빈 문자열로 두세요.",
].join(" ");

const WEDDING_RULES = [
  "documentType이 wedding(청첩)이면 공문이 아니라 한 장짜리 청첩장입니다.",
  "본문은 따뜻한 초대 문구로 쓰세요. 시적인 줄바꿈을 사용해도 됩니다.",
  "신랑, 신부, 예식 일시, 예식 장소는 fields에만 넣고 본문에 목록으로 반복하지 마세요.",
  "사진 필드는 만들지 말고 비워 두세요. 사진은 사용자가 직접 올립니다.",
  "회사 스타일, 부서, 서명은 청첩에 넣지 마세요.",
].join(" ");

const OBITUARY_RULES = [
  "documentType이 obituary(부고)이면 공문이 아니라 한 장짜리 부고 안내장입니다.",
  "본문은 짧은 부고 문장으로 쓰세요. 누구의 누가 별세했는지는 본문 문장 안에 넣으세요.",
  "고인 성함, 관계, 빈소, 발인은 fields에 넣고 본문에 빈소/발인 목록을 반복하지 마세요.",
  "배경 사진 필드는 만들지 말고 비워 두세요. 배경 사진은 사용자가 직접 올립니다.",
  "회사 스타일, 부서, 서명은 부고 안내장에 넣지 마세요.",
  "extra에는 장지, 상주, 조문 안내처럼 요구사항과 맥락에 맞는 부가 내용을 쓰세요.",
].join(" ");

const THANKS_RULES = [
  "documentType이 thanks(감사)이면 공문이 아니라 한 장짜리 감사장입니다.",
  "본문은 따뜻한 감사 인사 문구로 쓰세요. 편지처럼 줄바꿈을 사용해도 됩니다.",
  "수신, 보내는 이, 감사 사유는 fields에 넣고 본문에 '수신:' 목록을 반복하지 마세요.",
  "배경 사진 필드는 만들지 말고 비워 두세요. 배경 사진은 사용자가 직접 올립니다.",
  "회사 스타일, 부서, 서명은 감사장에 넣지 마세요.",
  "extra에는 여운 있는 한 줄이나 당부처럼 요구사항과 맥락에 맞는 부가 내용을 쓰세요.",
].join(" ");

const DESIGN_RULES = [
  "문서 내용과 분위기에 맞는 미리보기 디자인을 3개 추천하세요.",
  "가능한 디자인 id는 classic, modern, minimal 뿐입니다.",
  "recommendedDesigns에는 잘 맞는 순서대로 3개를 넣고, 가장 잘 맞는 것을 previewTemplateId로도 넣으세요.",
].join(" ");

const TEMPLATE_IDS = ["classic", "modern", "minimal"];

export function resolveRecommendedDesigns(parsed, documentType) {
  const fallback = DOCUMENT_TYPES.find((item) => item.id === documentType)
    ?.previewTemplateId ?? "classic";
  const raw = Array.isArray(parsed?.recommendedDesigns)
    ? parsed.recommendedDesigns
    : [];
  const ordered = [
    ...new Set(
      raw.filter((id) => TEMPLATE_IDS.includes(id)),
    ),
  ];
  const designs = ordered
    .concat(TEMPLATE_IDS.filter((id) => !ordered.includes(id)))
    .slice(0, 3);
  const previewTemplateId = TEMPLATE_IDS.includes(parsed?.previewTemplateId)
    ? parsed.previewTemplateId
    : designs[0] ?? fallback;

  return { designs, previewTemplateId };
}

export function buildExtractPrompt({
  prompt,
  tone,
  companyStyle,
  showSignature,
}) {
  return [
    "[TASK:OFFICIAL_DOCUMENT]",
    "당신은 한국어 공문 작성 도우미입니다.",
    "아래 사용자 요청에서 문서 정보를 추출하고 본문을 작성하세요.",
    "반드시 JSON만 출력하세요. 설명, 마크다운, 코드펜스는 넣지 마세요.",
    `문체: ${TONE_LABEL[tone] ?? "정중하게"} (${tone})`,
    BODY_AND_EXTRA_RULES,
    WEDDING_RULES,
    OBITUARY_RULES,
    THANKS_RULES,
    DESIGN_RULES,
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
      previewTemplateId: "classic",
      recommendedDesigns: ["classic", "modern", "minimal"],
    }),
    "사용자 요청:",
    prompt,
  ]
    .filter(Boolean)
    .join("\n");
}

export function inferTypeFromPrompt(prompt, category) {
  const text = String(prompt ?? "");
  const rules = [
    { id: "obituary", category: "official", pattern: /별세|부고|발인|빈소|고인/ },
    { id: "wedding", category: "official", pattern: /결혼|청첩|예식|신랑|신부/ },
    { id: "consolation", category: "official", pattern: /위문|병가|쾌유/ },
    { id: "thanks", category: "official", pattern: /감사/ },
    { id: "schedule", category: "official", pattern: /일정\s*변경|일정변경/ },
    { id: "event", category: "official", pattern: /행사|공유회/ },
    { id: "request", category: "work", pattern: /요청|제출|기한/ },
    { id: "meeting", category: "work", pattern: /회의/ },
    { id: "alert", category: "work", pattern: /알림/ },
    { id: "notice", category: "work", pattern: /공지|점검/ },
  ];

  const match = rules.find(
    (rule) =>
      rule.pattern.test(text) && (!category || rule.category === category),
  );
  if (match) return match.id;

  const fallback = category
    ? DOCUMENT_TYPES.find((item) => item.category === category)
    : DOCUMENT_TYPES[0];
  return fallback?.id ?? DOCUMENT_TYPES[0].id;
}

export function buildRegisterPrompt({ prompt, showSignature }) {
  return [
    "[TASK:OFFICIAL_DOCUMENT]",
    "당신은 한국어 공문 정보 추출기입니다.",
    "사용자 요청에서 문서 종류와 폼 필드를 추출하고, 그 정보로 공문 본문도 작성하세요.",
    "반드시 JSON만 출력하세요. 설명, 마크다운, 코드펜스는 넣지 마세요.",
    `가능한 documentType: ${DOCUMENT_TYPES.map((item) => item.id).join(", ")}`,
    `필드 스키마: ${JSON.stringify(fieldSchema())}`,
    "해당 documentType의 필드만 fields에 채우세요. 알 수 없는 값은 빈 문자열로 두세요.",
    BODY_AND_EXTRA_RULES,
    WEDDING_RULES,
    OBITUARY_RULES,
    THANKS_RULES,
    DESIGN_RULES,
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
      previewTemplateId: "classic",
      recommendedDesigns: ["classic", "modern", "minimal"],
    }),
    "사용자 요청:",
    prompt,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildProofreadPrompt(body, documentType) {
  const isWedding = documentType === "wedding";
  const isObituary = documentType === "obituary";
  const isThanks = documentType === "thanks";
  return [
    "[TASK:OFFICIAL_PROOFREAD]",
    isWedding
      ? "다음 청첩 문구의 맞춤법, 띄어쓰기, 문법을 검사하고 자연스럽게 고치세요."
      : isObituary
        ? "다음 부고 문구의 맞춤법, 띄어쓰기, 문법을 검사하고 자연스럽게 고치세요."
        : isThanks
          ? "다음 감사장 문구의 맞춤법, 띄어쓰기, 문법을 검사하고 자연스럽게 고치세요."
        : "다음 공문 본문의 맞춤법, 띄어쓰기, 문법을 검사하고 자연스럽게 고치세요.",
    "의미와 사실 정보는 유지하되, 문장 표현은 조금 다르게 다듬으세요.",
    isWedding
      ? "청첩 본문은 초대장 인사 문구입니다. 시적인 줄바꿈을 유지하세요."
      : isObituary
        ? "부고 본문은 짧은 안내 문장입니다. 애도의 문체를 유지하고 빈소/발인 목록은 넣지 마세요."
        : isThanks
          ? "감사장 본문은 편지 인사 문구입니다. 따뜻한 문체와 줄바꿈을 유지하세요."
        : "안내 문장과 추가 안내(목록·이름 포함 가능)는 유지하세요. '- 다음 -', '1. 일시'처럼 전용 필드용 항목 목록만 넣지 마세요.",
    "반드시 JSON만 출력하세요. 설명, 마크다운, 코드펜스는 넣지 마세요.",
    '응답 형식: {"body":"검수된 본문"}',
    "본문:",
    body,
  ].join("\n");
}

export function buildRewritePrompt({ body, tone, documentType }) {
  const isWedding = documentType === "wedding";
  const isObituary = documentType === "obituary";
  const isThanks = documentType === "thanks";
  return [
    "[TASK:OFFICIAL_REWRITE]",
    isWedding
      ? "다음 청첩 문구의 의미는 유지하고 문체만 바꾸세요. 초대장의 온기를 지키세요."
      : isObituary
        ? "다음 부고 문구의 의미는 유지하고 문체만 바꾸세요. 애도의 문체를 지키세요."
        : isThanks
          ? "다음 감사장 문구의 의미는 유지하고 문체만 바꾸세요. 편지의 온기를 지키세요."
        : "다음 공문 본문의 의미는 유지하고 문체만 바꾸세요.",
    isWedding
      ? "시적인 줄바꿈을 유지하고, 신랑·신부·일시·장소를 목록으로 나열하지 마세요."
      : isObituary
        ? "짧은 부고 문장을 유지하고, 빈소·발인을 목록으로 나열하지 마세요."
        : isThanks
          ? "편지 문장을 유지하고, 수신·보내는 이를 목록으로 나열하지 마세요."
        : "안내 문장과 추가 안내는 유지하고, '- 다음 -'이나 '1. 일시' 같은 전용 필드용 항목 목록만 넣지 마세요.",
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
