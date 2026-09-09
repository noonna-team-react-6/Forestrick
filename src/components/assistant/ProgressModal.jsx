export default function ProgressModal({
  progress,
  message,
}) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="AI 문서 생성 진행"
    >
      <div className="progress-modal">
        <div className="progress-symbol">
          ✦
        </div>

        <span className="progress-kicker">
          FORESTRICK AI
        </span>

        <h2>
          AI가 문서를 작성하고 있습니다.
        </h2>

        <p className="progress-message">
          {message}
        </p>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <strong className="progress-percent">
          {progress}%
        </strong>

        <p className="progress-caption">
          잠시만 기다려주세요.
        </p>
      </div>
    </div>
  );
}
