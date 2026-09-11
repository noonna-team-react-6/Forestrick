import "../../styles/ProgressModal.css";

export default function ProgressModal({
  progress,
  message,
}) {
  return (
    <div
      className="ai-progress-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="AI 문서 생성 진행"
    >
      <div className="ai-progress-modal">
        <div className="ai-progress-symbol">
          ✦
        </div>

        <span className="ai-progress-kicker">
          FORESTRICK AI
        </span>

        <h2>
          AI가 문서를 작성하고 있습니다.
        </h2>

        <p className="ai-progress-message">
          {message}
        </p>

        <div className="ai-progress-track">
          <div
            className="ai-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <strong className="ai-progress-percent">
          {progress}%
        </strong>

        <p className="ai-progress-caption">
          잠시만 기다려주세요.
        </p>
      </div>
    </div>
  );
}
