export const createAnalysisDocumentPrompt = (documentText) => {
  return `
[TASK:ANALYZE_DOCUMENT]

당신은 문서에서 업무 정보를 추출하는 AI 문서 분석기입니다.
아래 문서를 읽고 분석해 주세요.

[문서 내용]
${documentText}

다음 조건을 지켜 주세요.
1. 확인되지 않은 정보는 임의로 만들지 마세요.
2. 문서 종류(classification)는 "회의록", "이메일", "공문", "보고서" 중 가장 가까운 것으로 분류하고, 애매하면 "기타"로 표시하세요.
3. summary는 문서 종류와 관계없이 항상 실제 핵심 내용을 요약하세요.
4. 문서 안에 실제로 담당자·업무·마감일이 있는 경우에만 tasks 배열에 담고, 업무성 내용이 없으면 tasks를 빈 배열 []로 반환하세요. 억지로 만들어내지 마세요.
5. 설명 문장이나 마크다운 없이 JSON 객체만 반환하세요.

[응답 형식]
{
  "classification": "",
  "summary": "",
  "tasks": [
    { "assignee": "", "task": "", "deadline": "" }
  ]
}
`.trim();
};

export const createAnalysisDocumentAttachmentPrompt = (fileName) => {
  return `
[TASK:ANALYZE_DOCUMENT_FILE]

당신은 문서에서 업무 정보를 추출하는 AI 문서 분석기입니다.
첨부된 문서(${fileName})를 읽고 분석해 주세요.

다음 조건을 지켜 주세요.
1. 확인되지 않은 정보는 임의로 만들지 마세요.
2. 문서 종류(classification)는 "회의록", "이메일", "공문", "보고서" 중 가장 가까운 것으로 분류하고, 애매하면 "기타"로 표시하세요.
3. summary는 문서 종류와 관계없이 항상 실제 핵심 내용을 요약하세요.
4. 문서 안에 실제로 담당자·업무·마감일이 있는 경우에만 tasks 배열에 담고, 업무성 내용이 없으면 tasks를 빈 배열 []로 반환하세요. 억지로 만들어내지 마세요.
5. 설명 문장이나 마크다운 없이 JSON 객체만 반환하세요.

[응답 형식]
{
  "classification": "",
  "summary": "",
  "tasks": [
    { "assignee": "", "task": "", "deadline": "" }
  ]
}
`.trim();
};
