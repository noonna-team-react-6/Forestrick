import { OFFICIAL_DOCUMENT_EXAMPLES } from "../../data/mockTasks";

export default function OfficialInput({
  to,
  subject,
  content,
  isLoading,
  hasError,
  onFieldChange,
  onGenerate,
}) {
  const canGenerate =
    to.trim() && subject.trim() && content.trim();

  return (
    <article className="assistant-card input-card">
      <div className="card-title-row">
        <span className="sparkle-icon">✦</span>

        <div>
          <h2>어떤 공문을 작성할까요?</h2>
          <p>
            수신 대상과 제목, 핵심 내용을 입력하면 격식 있는
            공문으로 정리해 드려요.
          </p>
        </div>
      </div>

      <label className="official-field">
        <span>수신</span>
        <input
          type="text"
          value={to}
          onChange={(event) =>
            onFieldChange("to", event.target.value)
          }
          placeholder="예) 전 직원, 인사팀"
        />
      </label>

      <label className="official-field">
        <span>제목</span>
        <input
          type="text"
          value={subject}
          onChange={(event) =>
            onFieldChange("subject", event.target.value)
          }
          placeholder="예) 신규 협업 시스템 도입 안내"
        />
      </label>

      <label className="official-field">
        <span>핵심 내용</span>
        <textarea
          className="assistant-textarea"
          value={content}
          onChange={(event) =>
            onFieldChange("content", event.target.value)
          }
          placeholder="예) 다음 달부터 새로운 협업 시스템을 도입합니다. 사용 방법 교육은 이번 주 금요일에 진행됩니다."
        />
      </label>

      <div className="example-row">
        <span className="example-label">예시</span>

        <div className="example-chips">
          {OFFICIAL_DOCUMENT_EXAMPLES.map((example) => (
            <button
              key={example.subject}
              type="button"
              onClick={() => {
                onFieldChange("to", example.to);
                onFieldChange("subject", example.subject);
                onFieldChange("content", example.content);
              }}
            >
              {example.subject}
            </button>
          ))}
        </div>
      </div>

      <button
        className="primary-action analyze-button"
        type="button"
        disabled={!canGenerate || isLoading}
        onClick={onGenerate}
      >
        <span>✦</span>
        {isLoading ? "공문을 작성하고 있어요..." : "공문 생성하기"}
      </button>

      {hasError && (
        <div className="inline-error">
          공문 생성 중 오류가 발생했습니다. 잠시 후 다시
          시도해 주세요.
        </div>
      )}
    </article>
  );
}
