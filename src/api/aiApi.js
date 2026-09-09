const USE_MOCK = import.meta.env.VITE_USE_MOCK_AI !== "false";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function makeMockAnalysis(text) {
  const hasMonday = text.includes("월요일");
  const hasFriday = text.includes("금요일");
  const timeMatch = text.match(/(오전|오후)\s?\d{1,2}시(?:\s?\d{1,2}분)?/);
  const placeMatch = text.match(/(\d+층\s*)?[\w가-힣]+회의실/);

  return {
    taskType: "회의",
    title: text.includes("신제품") ? "신제품 출시 관련 팀 미팅" : "업무 요청",
    date: hasMonday ? "다음 주 월요일" : hasFriday ? "이번 주 금요일" : "일정 확인 필요",
    time: timeMatch?.[0] || "시간 확인 필요",
    location: placeMatch?.[0] || "회의실",
    target: text.includes("개발팀") ? "개발팀 참석자" : "관련 팀",
    summary: "회의 일정과 문서 작성이 필요한 업무로 파악했습니다.",
    actions: [
      "회의 참석자 안내 문서 작성",
      "회의 일정 정리",
      "회의실 예약 확인",
    ],
  };
}

function makeMockDocument(payload) {
  const { analysis } = payload;
  return {
    title: `${analysis.topic || "업무"} 안내`,
    to: analysis.target || "관련 참석자",
    subject: `${analysis.topic || "업무"} 안내`,
    greeting: "안녕하세요.",
    paragraphs: [
      `${analysis.dateTime || "예정된 일정"}에 ${analysis.location || "회의실"}에서 진행되는 ${analysis.topic || "업무"} 관련 안내드립니다.`,
      "업무 진행에 필요한 내용을 사전에 확인해 주시고, 변경 사항이 있는 경우 담당자에게 알려주시기 바랍니다.",
      "확인 후 회신해 주시면 업무 진행에 도움이 됩니다.",
    ],
    closing: "감사합니다.",
    signature: "기획팀 드림",
  };
}

async function postAi(payload) {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "AI 요청에 실패했습니다.");
  }
  return response.json();
}

export async function analyzeTask(text) {
  if (USE_MOCK) {
    await sleep(700);
    return makeMockAnalysis(text);
  }

  return postAi({
    type: "analyze",
    text,
  });
}

export async function generateDocument(payload) {
  if (USE_MOCK) {
    await sleep(3000);
    return makeMockDocument(payload);
  }

  return postAi({
    type: "generate",
    ...payload,
  });
}
