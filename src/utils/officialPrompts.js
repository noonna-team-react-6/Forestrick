export const createOfficialDocumentPrompt = ({
  to,
  subject,
  content,
}) => {
  return `
[TASK:GENERATE_OFFICIAL_DOCUMENT]

당신은 한국 기업·기관의 공문(공식 안내문)을 작성하는 AI 문서 작성 비서입니다.
아래 정보를 바탕으로 격식 있는 공문 형식의 한국어 문서를 작성해 주세요.

[수신]
${to}

[제목/목적]
${subject}

[핵심 내용]
${content}

다음 조건을 지켜 주세요.
1. 확인되지 않은 사실을 새로 만들지 마세요.
2. 공문에 어울리는 격식 있고 정중한 어투를 사용하세요.
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
