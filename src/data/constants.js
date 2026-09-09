export const EDIT_OPTIONS = {
  기본: [
    {
      label: "문장 다듬기",
      prompt:
        "문장의 의미는 유지하면서 자연스럽고 읽기 좋은 문장으로 다듬어 주세요.",
    },
    {
      label: "간결하게",
      prompt:
        "문장의 핵심 의미는 유지하면서 불필요한 표현을 제거하고 간결하게 바꿔 주세요.",
    },
    {
      label: "길게 작성",
      prompt:
        "문장의 핵심 의미는 유지하면서 내용을 더 자세하고 구체적으로 작성해 주세요.",
    },
  ],

  톤: [
    {
      label: "더 정중하게",
      prompt:
        "문장의 의미는 유지하면서 더 정중하고 예의 바른 표현으로 바꿔 주세요.",
    },
    {
      label: "격식 있게",
      prompt:
        "문장의 의미는 유지하면서 비즈니스 문서에 어울리는 격식 있는 표현으로 바꿔 주세요.",
    },
    {
      label: "친근하게",
      prompt:
        "문장의 의미는 유지하면서 자연스럽고 친근한 표현으로 바꿔 주세요.",
    },
  ],

  번역: [
    {
      label: "영어",
      prompt:
        "문장의 의미를 유지하면서 자연스러운 영어로 번역해 주세요.",
    },
    {
      label: "중국어",
      prompt:
        "문장의 의미를 유지하면서 자연스러운 중국어로 번역해 주세요.",
    },
    {
      label: "스페인어",
      prompt:
        "문장의 의미를 유지하면서 자연스러운 스페인어로 번역해 주세요.",
    },
    {
      label: "일본어",
      prompt:
        "문장의 의미를 유지하면서 자연스러운 일본어로 번역해 주세요.",
    },
  ],
};

export const getEditPrompt = (label) => {
  for (const options of Object.values(EDIT_OPTIONS)) {
    const option = options.find((item) => item.label === label);

    if (option) {
      return option.prompt;
    }
  }

  return "";
};