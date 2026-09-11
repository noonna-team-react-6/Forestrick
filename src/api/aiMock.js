const MOCK_DELAY = 700;

const wait = (milliseconds) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const createAnalysisMock = () => {
  return JSON.stringify({
    taskType: "회의",
    title: "신제품 출시 관련 팀 미팅",
    date: "다음 주 월요일",
    time: "오전 10시",
    location: "3층 회의실",
    target: "관련 팀",
    summary: "회의 일정과 참석자 안내, 사전 준비가 필요한 업무로 파악했습니다.",
    actions: [
      "회의 참석자 안내 문서 작성",
      "회의 일정 정리",
      "회의실 예약 확인",
    ],
  });
};

const createDocumentMock = () => {
  return JSON.stringify({
    title: "신제품 출시 관련 팀 미팅 안내",
    to: "관련 참석자",
    subject: "신제품 출시 관련 팀 미팅 안내",
    greeting: "안녕하세요.",
    paragraphs: [
      "다음 주 월요일 오전 10시에 3층 회의실에서 신제품 출시 관련 팀 미팅을 진행합니다.",
      "참석자께서는 회의 전 관련 자료와 주요 안건을 확인해 주시기 바랍니다.",
      "일정 또는 참석 여부에 변경이 있는 경우 담당자에게 알려주시기 바랍니다.",
    ],
    closing: "감사합니다.",
    signature: "기획팀 드림",
  });
};

const ACTION_VERBS = [
  "작성",
  "제작",
  "제출",
  "발송",
  "준비",
  "검토",
  "확인",
  "완료",
  "보고",
  "공유",
];

const classifyDocumentMock = (text) => {
  if (text.includes("회의")) return "회의록";
  if (text.includes("안내드립니다") || text.includes("공문")) return "공문";
  if (text.includes("보고")) return "보고서";
  if (text.includes("안녕하세요") || text.includes("메일")) return "이메일";
  return "기타";
};

const extractTasksMock = (text) => {
  const pattern =
    /([가-힣A-Za-z0-9]+)(?:은|는)\s*(.+?)(?:을|를)\s*(\d{1,2}월\s*\d{1,2}일)까지\s*([가-힣]+)/g;

  const tasks = [];
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const [, assignee, object, deadline, verbRaw] = match;
    const verb =
      ACTION_VERBS.find((candidate) => verbRaw.startsWith(candidate)) ??
      verbRaw;

    tasks.push({
      assignee: assignee.trim(),
      task: `${object.trim()} ${verb}`.trim(),
      deadline: deadline.replace(/\s+/g, " "),
    });
  }

  if (tasks.length === 0) {
    return [{ assignee: "확인 필요", task: "확인 필요", deadline: "확인 필요" }];
  }

  return tasks;
};

const createAnalysisDocumentMock = (text) => {
  return JSON.stringify({
    classification: classifyDocumentMock(text),
    summary: text.length > 60 ? `${text.slice(0, 60)}...` : text,
    tasks: extractTasksMock(text),
  });
};

export const generateMockAI = async (prompt) => {
  await wait(MOCK_DELAY);

  if (prompt.includes("[TASK:ANALYZE_DOCUMENT]")) {
    await wait(1000);

    const [, documentText = ""] =
      prompt.match(/\[문서 내용\]\n([\s\S]*?)\n\n다음 조건/) ?? [];

    return createAnalysisDocumentMock(documentText.trim());
  }

  if (prompt.includes("[TASK:ANALYZE_DOCUMENT_FILE]")) {
    await wait(1000);

    return JSON.stringify({
      classification: "기타",
      summary:
        "모의(Mock) 모드에서는 첨부 파일 내용을 직접 읽을 수 없어 예시 응답을 보여드립니다. 실제 분석을 확인하려면 .env에서 VITE_USE_MOCK_AI=false로 설정해 주세요.",
      tasks: [
        { assignee: "확인 필요", task: "확인 필요", deadline: "확인 필요" },
      ],
    });
  }

  if (prompt.includes("[TASK:ANALYZE]")) {
    return createAnalysisMock();
  }

  if (prompt.includes("[TASK:GENERATE_DOCUMENT]")) {
    await wait(1400);
    return createDocumentMock();
  }

  return JSON.stringify({
    message: "Mock AI 응답입니다.",
  });
};
