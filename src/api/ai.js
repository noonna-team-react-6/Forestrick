import axios from "axios";

import { MOCK_ANALYSIS_ACTIONS } from "../data/mockTasks";

const IS_MOCK_AI_ENABLED =
  import.meta.env.VITE_USE_MOCK_AI !== "false";
const MOCK_ANALYSIS_DELAY = 700;
const MOCK_GENERATE_DELAY = 3000;

const wait = (milliseconds) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const createMockAnalysis = (text) => {
  const hasMonday = text.includes("월요일");
  const hasFriday = text.includes("금요일");
  const timeMatch = text.match(
    /(오전|오후)\s?\d{1,2}시(?:\s?\d{1,2}분)?/
  );
  const placeMatch = text.match(
    /(\d+층\s*)?[\w가-힣]+회의실/
  );

  return {
    taskType: "회의",
    title: text.includes("신제품")
      ? "신제품 출시 관련 팀 미팅"
      : "업무 요청",
    date: hasMonday
      ? "다음 주 월요일"
      : hasFriday
        ? "이번 주 금요일"
        : "일정 확인 필요",
    time: timeMatch?.[0] || "시간 확인 필요",
    location: placeMatch?.[0] || "회의실",
    target: text.includes("개발팀")
      ? "개발팀 참석자"
      : "관련 팀",
    summary:
      "회의 일정과 문서 작성이 필요한 업무로 파악했습니다.",
    actions: MOCK_ANALYSIS_ACTIONS,
  };
};

const createMockDocument = (prompt) => {
  const { analysis } = prompt;

  return {
    title: `${analysis.topic || "업무"} 안내`,
    to: analysis.target || "관련 참석자",
    subject: `${analysis.topic || "업무"} 안내`,
    greeting: "안녕하세요.",
    paragraphs: [
      `${analysis.dateTime || "예정된 일정"}에 ${
        analysis.location || "회의실"
      }에서 진행되는 ${
        analysis.topic || "업무"
      } 관련 안내드립니다.`,
      "업무 진행에 필요한 내용을 사전에 확인해 주시고, 변경 사항이 있는 경우 담당자에게 알려주시기 바랍니다.",
      "확인 후 회신해 주시면 업무 진행에 도움이 됩니다.",
    ],
    closing: "감사합니다.",
    signature: "기획팀 드림",
  };
};

const generateMockAI = async (prompt) => {
  if (prompt.type === "analyze") {
    await wait(MOCK_ANALYSIS_DELAY);
    return createMockAnalysis(prompt.text);
  }

  if (prompt.type === "generate") {
    await wait(MOCK_GENERATE_DELAY);
    return createMockDocument(prompt);
  }

  throw new Error("지원하지 않는 Mock AI 요청입니다.");
};

export const generateAI = async (provider, prompt) => {
  if (IS_MOCK_AI_ENABLED) {
    return generateMockAI(prompt);
  }

  const response = await axios.post("/api/ai", {
    provider,
    prompt,
  });

  return response.data;
};
