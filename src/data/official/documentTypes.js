export const DOCUMENT_CATEGORIES = [
  { id: "official", label: "공문 / 공지" },
  { id: "work", label: "업무문서" },
];

export const TONES = [
  { id: "polite", label: "정중하게", moreLabel: "더 정중하게" },
  { id: "formal", label: "격식있게", moreLabel: "더 격식있게" },
  { id: "concise", label: "간결하게", moreLabel: "더 간결하게" },
];

export const DOCUMENT_TYPES = [
  {
    id: "obituary",
    label: "부고",
    category: "official",
    template: "obituary",
    previewTemplateId: "classic",
    title: "부고",
    fields: [
      { key: "deceasedName", label: "고인 성함" },
      { key: "relationship", label: "관계" },
      { key: "funeralHome", label: "빈소" },
      { key: "funeralDate", label: "발인" },
      { key: "background", label: "배경 사진", type: "image" },
      { key: "extra", label: "추가 내용", multiline: true },
    ],
  },
  {
    id: "wedding",
    label: "청첩",
    category: "official",
    template: "wedding",
    previewTemplateId: "classic",
    title: "청첩",
    fields: [
      { key: "groomsName", label: "신랑" },
      { key: "bridesName", label: "신부" },
      { key: "photo", label: "웨딩 사진", type: "image" },
      { key: "venue", label: "예식 장소" },
      { key: "date", label: "예식 일시" },
      { key: "extra", label: "추가 내용", multiline: true },
    ],
  },
  {
    id: "thanks",
    label: "감사",
    category: "official",
    template: "thanks",
    previewTemplateId: "classic",
    title: "감사장",
    fields: [
      { key: "recipient", label: "수신" },
      { key: "senderName", label: "보내는 이" },
      { key: "reason", label: "감사 사유" },
      { key: "background", label: "배경 사진", type: "image" },
      { key: "extra", label: "추가 내용", multiline: true },
    ],
  },
  {
    id: "consolation",
    label: "위문",
    category: "official",
    template: "notice",
    previewTemplateId: "modern",
    title: "위문문",
    fields: [
      { key: "recipient", label: "수신" },
      { key: "reason", label: "위문 사유" },
      { key: "extra", label: "추가 내용", multiline: true },
    ],
  },
  {
    id: "event",
    label: "행사",
    category: "official",
    template: "notice",
    previewTemplateId: "minimal",
    title: "행사 안내",
    fields: [
      { key: "title", label: "행사명" },
      { key: "datetime", label: "일시" },
      { key: "venue", label: "장소" },
      { key: "extra", label: "추가 내용", multiline: true },
    ],
  },
    {
      id: "schedule",
      label: "일정 변경",
      category: "official",
      template: "notice",
      previewTemplateId: "minimal",
      title: "일정 변경 안내",
      fields: [
        { key: "originalDate", label: "기존 일정" },
        { key: "newDate", label: "변경 일정" },
        { key: "venue", label: "장소" },
        { key: "reason", label: "변경 사유" },
        { key: "extra", label: "추가 내용", multiline: true },
      ],
    },
    {
      id: "notice",
      label: "공지",
      category: "work",
      template: "notice",
      previewTemplateId: "modern",
      title: "공지",
      fields: [
        { key: "title", label: "제목" },
        { key: "audience", label: "대상" },
        { key: "datetime", label: "게시일" },
        { key: "extra", label: "추가 내용", multiline: true },
      ],
    },
    {
      id: "alert",
      label: "알림",
      category: "work",
      template: "notice",
      previewTemplateId: "minimal",
      title: "알림",
      fields: [
        { key: "title", label: "제목" },
        { key: "audience", label: "수신 대상" },
        { key: "datetime", label: "일시" },
        { key: "extra", label: "추가 내용", multiline: true },
      ],
    },
    {
      id: "meeting",
      label: "회의",
      category: "work",
      template: "notice",
      previewTemplateId: "classic",
      title: "회의 안내",
      fields: [
        { key: "title", label: "회의명" },
        { key: "datetime", label: "일시" },
        { key: "venue", label: "장소" },
        { key: "extra", label: "추가 내용", multiline: true },
      ],
    },
    {
      id: "request",
      label: "요청",
      category: "work",
      template: "notice",
      previewTemplateId: "modern",
      title: "업무 요청",
      fields: [
        { key: "recipient", label: "수신" },
        { key: "title", label: "요청 사항" },
        { key: "deadline", label: "기한" },
        { key: "extra", label: "추가 내용", multiline: true },
      ],
    },
];

export const COMMON_FIELDS = [
  { key: "department", label: "부서명" },
  { key: "signerName", label: "이름" },
];

export const PREVIEW_TEMPLATES = [
  { id: "classic", label: "클래식" },
  { id: "modern", label: "모던" },
  { id: "minimal", label: "미니멀" },
];
