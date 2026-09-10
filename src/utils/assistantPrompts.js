const REWRITE_STYLE_GUIDE = {
  formal:
    "문장을 더 정중하고 공식적인 업무 문체로 다듬어 주세요. 지나친 극존칭은 피하고 자연스러운 비즈니스 존댓말을 사용하세요.",
  concise:
    "중복 표현과 불필요한 문장을 줄여 핵심 내용이 빠르게 전달되도록 더 간결하게 다듬어 주세요.",
  warm:
    "업무 문서의 명확성은 유지하면서 상대방에게 부담을 주지 않는 부드럽고 따뜻한 표현으로 다듬어 주세요.",
};

export const createAnalysisPrompt = (requestText) => {
  return `
[TASK:ANALYZE]

당신은 한국어 업무 비서입니다.
아래 사용자의 업무 요청을 분석해 주세요.

[사용자 요청]
${requestText}

다음 조건을 지켜 주세요.
1. 확인되지 않은 정보는 임의로 만들지 마세요.
2. 날짜, 시간, 장소, 대상이 명확하지 않으면 "확인 필요"라고 작성하세요.
3. 필요한 후속 작업을 actions 배열에 2~4개로 정리하세요.
4. 설명 문장이나 마크다운 없이 JSON 객체만 반환하세요.

[응답 형식]
{
  "taskType": "",
  "title": "",
  "date": "",
  "time": "",
  "location": "",
  "target": "",
  "summary": "",
  "actions": []
}
`.trim();
};

export const createDocumentPrompt = ({
  originalRequest,
  analysis,
  selectedActions,
}) => {
  return `
[TASK:GENERATE_DOCUMENT]

당신은 한국 기업·기관의 실무 문서를 작성하는 AI 업무 비서입니다.
아래 정보를 바탕으로 자연스럽고 간결한 한국어 안내 문서를 작성해 주세요.

[원래 요청]
${originalRequest}

[업무 분석 결과]
${JSON.stringify(analysis, null, 2)}

[사용자가 선택한 작업]
${selectedActions.join(", ")}

다음 조건을 지켜 주세요.
1. 확인되지 않은 사실을 새로 만들지 마세요.
2. 실제 업무에서 바로 사용할 수 있는 자연스러운 문장으로 작성하세요.
3. 과도하게 길거나 장황하게 작성하지 마세요.
4. 설명 문장이나 마크다운 없이 JSON 객체만 반환하세요.

[응답 형식]
{
  "title": "",
  "to": "",
  "subject": "",
  "greeting": "",
  "paragraphs": [],
  "closing": "",
  "signature": ""
}
`.trim();
};

export const createRewritePrompt = ({
  rewriteStyle,
  documentText,
  originalRequest,
  analysis,
}) => {
  const styleGuide =
    REWRITE_STYLE_GUIDE[rewriteStyle];

  if (!styleGuide) {
    throw new Error(
      `지원하지 않는 문체입니다: ${rewriteStyle}`
    );
  }

  return `
[TASK:REWRITE_DOCUMENT]

당신은 한국 기업·기관의 실무 문서를 교정하는 AI 비서입니다.
아래 문서를 사용자가 선택한 방식으로 다시 다듬어 주세요.

[문체 요청]
${styleGuide}

[사용자의 원래 업무 요청]
${originalRequest}

[업무 분석 결과]
${JSON.stringify(analysis, null, 2)}

[현재 문서]
${documentText}

다음 조건을 지켜 주세요.
1. 일정, 장소, 대상 등 핵심 사실은 임의로 변경하지 마세요.
2. 원문에 없는 사실을 새로 만들지 마세요.
3. 선택한 문체에 맞게 제목과 본문을 함께 다듬어 주세요.
4. 설명 문장이나 마크다운 없이 JSON 객체만 반환하세요.

[응답 형식]
{
  "title": "",
  "to": "",
  "subject": "",
  "greeting": "",
  "paragraphs": [],
  "closing": "",
  "signature": ""
}
`.trim();
};
