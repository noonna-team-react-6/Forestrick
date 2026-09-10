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

export const generateMockAI = async (prompt) => {
  await wait(MOCK_DELAY);

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
