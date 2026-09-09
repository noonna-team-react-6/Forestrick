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
