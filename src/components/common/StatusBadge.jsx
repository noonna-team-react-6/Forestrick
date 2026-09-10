import "./common.css";

const STATUS_LABELS = {
  ready: "AI 준비 완료",
  mock: "AI 데모 모드",
  loading: "AI 준비 중",
  unavailable: "AI 설정 필요",
  error: "AI 연결 오류",
};

export default function StatusBadge({ status, tone = "dark", className = "" }) {
  const label = STATUS_LABELS[status];

  if (!label) return null;

  return (
    <span className={`ui-status-badge ui-status-badge--${tone} ui-status-badge--${status} ${className}`.trim()}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}
