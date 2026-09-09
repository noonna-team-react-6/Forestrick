const removeCodeFence = (value) => {
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

export const parseAIJson = (response) => {
  if (typeof response !== "string") {
    return response;
  }

  const cleanResponse = removeCodeFence(response);

  try {
    return JSON.parse(cleanResponse);
  } catch {
    throw new Error(
      "AI 응답을 JSON 형식으로 변환하지 못했습니다."
    );
  }
};
