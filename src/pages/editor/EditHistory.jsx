import { useState } from "react";

function EditHistory({ history, onSelect }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="edit-history">
      <div className="edit-history-header">
        <div className="history-title">
          <span className="history-icon">
            ◷
          </span>

          <h2>AI 편집 기록</h2>

          <span className="history-count">
            {history.length}
          </span>
        </div>

        <button
          className="history-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen ? "편집 기록 접기" : "편집 기록 펼치기"
          }
        >
          {isOpen ? "⌃" : "⌄"}
        </button>
      </div>

      {isOpen && (
        <div className="history-list">
          {history.length === 0 ? (
            <div className="history-empty">
              아직 편집 기록이 없습니다.
            </div>
          ) : (
            history.map((item, index) => (
              <button
                className={`history-item ${
                  index === 0 ? "current" : ""
                }`}
                key={item.id}
                onClick={() => onSelect(item)}
              >
                <span className="history-time">
                  {item.time}
                </span>

                <span className="history-action">
                  {item.action}
                </span>

                {index === 0 && (
                  <span className="history-current">
                    현재 결과
                  </span>
                )}

                <span className="history-arrow">
                  ›
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default EditHistory;