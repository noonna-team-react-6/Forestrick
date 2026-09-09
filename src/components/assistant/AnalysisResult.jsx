export default function AnalysisResult({
  analysis,
  selectedActions,
  isGenerating,
  hasError,
  onActionToggle,
  onGenerate,
}) {
  if (!analysis) {
    return (
      <article className="assistant-card analysis-card">
        <div className="empty-analysis">
          <div className="empty-icon">▣</div>
          <strong>분석 결과가 여기에 보여요</strong>
          <p>
            업무 내용을 입력하고 분석하기를
            눌러보세요.
          </p>
        </div>
      </article>
    );
  }

  const hasSelectedActions =
    selectedActions.length > 0;

  return (
    <article className="assistant-card analysis-card is-ready">
      <div className="analysis-header">
        <div>
          <span className="eyebrow">
            AI 업무 분석
          </span>

          <h2>무슨 일인지 파악했어요</h2>
          <p>{analysis.summary}</p>
        </div>

        <span className="analysis-complete">
          분석 완료
        </span>
      </div>

      <div className="analysis-grid">
        <div>
          <span>주제</span>
          <strong>{analysis.topic}</strong>
        </div>

        <div>
          <span>일시</span>
          <strong>{analysis.dateTime}</strong>
        </div>

        <div>
          <span>장소</span>
          <strong>{analysis.location}</strong>
        </div>

        <div>
          <span>대상</span>
          <strong>{analysis.target}</strong>
        </div>
      </div>

      <div className="task-section">
        <div className="task-section-title">
          <span>필요한 작업</span>
          <small>
            {selectedActions.length}개 선택
          </small>
        </div>

        <div className="task-list">
          {analysis.actions.map((action) => {
            const isSelected =
              selectedActions.includes(action.id);

            return (
              <button
                key={action.id}
                type="button"
                className={`task-item ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() =>
                  onActionToggle(action.id)
                }
              >
                <span className="task-checkbox">
                  {isSelected ? "✓" : ""}
                </span>

                <span>
                  <strong>
                    {action.label}
                  </strong>

                  <small>
                    {analysis.dateTime}
                    {" · "}
                    {analysis.location}
                  </small>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="analysis-recommendation">
        <strong>
          {analysis.dateTime} 기준으로
          선택한 업무를 준비할게요.
        </strong>

        <p>
          실행 전 선택 항목을 다시 확인해 주세요.
        </p>
      </div>

      {hasError && (
        <div className="inline-error">
          문서 생성 중 오류가 발생했습니다.
          잠시 후 다시 시도해 주세요.
        </div>
      )}

      <button
        className="primary-action execute-button"
        type="button"
        disabled={
          !hasSelectedActions ||
          isGenerating
        }
        onClick={onGenerate}
      >
        <span>✦</span>
        선택한 작업 실행하기
      </button>
    </article>
  );
}
