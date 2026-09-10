import { ASSISTANT_EXAMPLES } from "../../../data/mockTasks";

export default function AssistantInput({
  input,
  isLoading,
  hasError,
  onInputChange,
  onAnalyze,
}) {
  return (
    <article className="assistant-card input-card">
      <div className="card-title-row">
        <span className="sparkle-icon">✦</span>

        <div>
          <h2>어떤 업무를 도와드릴까요?</h2>
          <p>양식 없이, 사람에게 말하듯 입력해 주세요.</p>
        </div>
      </div>

      <textarea
        className="assistant-textarea"
        value={input}
        onChange={(event) =>
          onInputChange(event.target.value)
        }
        placeholder="예) 다음 주 월요일 오전 10시에 3층 회의실에서 팀 미팅을 진행합니다."
      />

      <div className="example-row">
        <span className="example-label">예시</span>

        <div className="example-chips">
          {ASSISTANT_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onInputChange(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <button
        className="primary-action analyze-button"
        type="button"
        disabled={!input.trim() || isLoading}
        onClick={onAnalyze}
      >
        <span>✦</span>
        {isLoading
          ? "업무를 파악하고 있어요..."
          : "업무 분석하기"}
      </button>

      {hasError && (
        <div className="inline-error">
          업무 분석 중 오류가 발생했습니다.
          잠시 후 다시 시도해 주세요.
        </div>
      )}
    </article>
  );
}
