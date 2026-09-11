import "./ProgressModal.css";

export default function ProgressModal({ progress = 0, message, title = "AI가 문서를 작성하고 있습니다." }) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="ui-progress-modal__backdrop">
      <section className="ui-progress-modal" role="dialog" aria-modal="true" aria-label="AI 문서 생성 진행">
        <div className="ui-progress-modal__symbol" aria-hidden="true">
          ✦
        </div>
        <span className="ui-progress-modal__kicker">FORESTRICK AI</span>
        <h2>{title}</h2>
        {message && <p className="ui-progress-modal__message">{message}</p>}
        <div className="ui-progress-modal__track" aria-label={`진행률 ${safeProgress}%`}>
          <div className="ui-progress-modal__fill" style={{ width: `${safeProgress}%` }} />
        </div>
        <strong className="ui-progress-modal__percent">{safeProgress}%</strong>
        <p className="ui-progress-modal__caption">잠시만 기다려주세요.</p>
      </section>
    </div>
  );
}
