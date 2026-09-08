function Svg({ children, size = 18, stroke = 1.7, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** 반짝임 (스파크) */
export const IconSpark = (props) => (
  <Svg {...props}>
    <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3z" />
  </Svg>
);

/** 사이드 패널 */
export const IconPanel = (props) => (
  <Svg {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </Svg>
);

/** 캘린더 */
export const IconCalendar = (props) => (
  <Svg {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </Svg>
);

/** 문서 추가 */
export const IconFilePlus = (props) => (
  <Svg {...props}>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
    <path d="M14 3v5h5M12 13v6M9 16h6" />
  </Svg>
);

/** 문서 스캔 */
export const IconScan = (props) => (
  <Svg {...props}>
    <path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" />
    <path d="M7 12h10" />
  </Svg>
);

/** 마법 지팡이 (AI 교정) */
export const IconWand = (props) => (
  <Svg {...props}>
    <path d="M15 4l5 5M4 20l9.5-9.5" />
    <path d="M18 3v3M21 6h-3M7 3l.8 2.2L10 6l-2.2.8L7 9l-.8-2.2L4 6l2.2-.8L7 3z" />
  </Svg>
);

/** 보관함 */
export const IconArchive = (props) => (
  <Svg {...props}>
    <rect x="3" y="4" width="18" height="5" rx="1" />
    <path d="M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M10 13h4" />
  </Svg>
);

/** 시계 */
export const IconClock = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

/** 폴더 */
export const IconFolder = (props) => (
  <Svg {...props}>
    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </Svg>
);

/** 공유 */
export const IconShare = (props) => (
  <Svg {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </Svg>
);

/** 별 (빈 별) */
export const IconStar = (props) => (
  <Svg {...props}>
    <path d="M12 3l2.6 5.6L21 9.3l-4.5 4.2L17.7 21 12 17.8 6.3 21l1.2-7.5L3 9.3l6.4-.7L12 3z" />
  </Svg>
);

/** 별 (채워진 별) */
export const IconStarFill = ({ size = 18, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 3l2.6 5.6L21 9.3l-4.5 4.2L17.7 21 12 17.8 6.3 21l1.2-7.5L3 9.3l6.4-.7L12 3z" />
  </svg>
);

/** 설정 */
export const IconSettings = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </Svg>
);

/** 도움말 */
export const IconHelp = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.1 9a3 3 0 015.8 1c0 2-3 2-3 4" />
    <path d="M12 17h.01" />
  </Svg>
);

/** 추가 (+) */
export const IconPlus = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

/** 연필 (수정) */
export const IconPencil = (props) => (
  <Svg {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </Svg>
);

/** 복사 */
export const IconCopy = (props) => (
  <Svg {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </Svg>
);

/** 삭제 (휴지통) */
export const IconTrash = (props) => (
  <Svg {...props}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
  </Svg>
);

/** 클립보드 */
export const IconClipboard = (props) => (
  <Svg {...props}>
    <rect x="6" y="5" width="12" height="16" rx="2" />
    <path d="M9 5V4a2 2 0 012-2h2a2 2 0 012 2v1" />
    <path d="M9 11h6M9 15h4" />
  </Svg>
);

/** 검색 */
export const IconSearch = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
);

/** 알림 (종) */
export const IconBell = (props) => (
  <Svg {...props}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </Svg>
);

/** 오른쪽 화살표 */
export const IconChevron = (props) => (
  <Svg {...props}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);

/** 반짝임 여러 개 (AI) */
export const IconSparkles = (props) => (
  <Svg {...props}>
    <path d="M12 3l1.2 3.6L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.4L12 3z" />
    <path d="M19 13l.7 1.8L21.5 15.5 19.7 16.2 19 18l-.7-1.8L16.5 15.5l1.8-.7L19 13z" />
    <path d="M6 14l.8 2L9 17l-2.2.7L6 20l-.8-2.3L3 17l2.2-.9L6 14z" />
  </Svg>
);

/** 업로드 */
export const IconUpload = (props) => (
  <Svg {...props}>
    <path d="M12 16V6" />
    <path d="M8 10l4-4 4 4" />
    <path d="M4 18h16" />
  </Svg>
);

/** 인쇄 */
export const IconPrint = (props) => (
  <Svg {...props}>
    <path d="M6 9V4h12v5" />
    <rect x="6" y="13" width="12" height="7" rx="1" />
    <path d="M6 17H4a2 2 0 01-2-2v-3a3 3 0 013-3h14a3 3 0 013 3v3a2 2 0 01-2 2h-2" />
  </Svg>
);

/** 홈 */
export const IconHome = (props) => (
  <Svg {...props}>
    <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1z" />
  </Svg>
);

/** 문서 */
export const IconFile = (props) => (
  <Svg {...props}>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
    <path d="M14 3v5h5" />
  </Svg>
);

/** 체크 (완료) */
export const IconCheck = (props) => (
  <Svg {...props}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

/** 다운로드 */
export const IconDownload = (props) => (
  <Svg {...props}>
    <path d="M12 4v12" />
    <path d="M7 11l5 5 5-5" />
    <path d="M4 20h16" />
  </Svg>
);

/** 닫기 (X) */
export const IconX = (props) => (
  <Svg {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
