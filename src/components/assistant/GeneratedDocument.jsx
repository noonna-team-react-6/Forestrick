import { useState } from "react";

import { documentToPlainText } from "../../utils/documentUtils";

export default function GeneratedDocument({
  document,
  onClose,
  onCopy,
  onPrintPdf,
  onDownloadText,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(
    documentToPlainText(document)
  );

  const documentText = isEditing
    ? editedText
    : documentToPlainText(document);

  const handleEditToggle = () => {
    setIsEditing(
      (previousState) => !previousState
    );
  };

  const handleCopy = () => {
    onCopy(documentText);
  };

  const handlePrintPdf = () => {
    onPrintPdf(documentText);
  };

  const handleDownloadText = () => {
    onDownloadText(documentText);
  };

  const handleSave = () => {
    onSave(documentText);
  };

  return (
    <div
      className="modal-backdrop result-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="AI 생성 결과"
    >
      <div className="result-modal">
        <div className="result-modal-header">
          <div>
            <span className="result-kicker">
              AI 생성 완료
            </span>
            <h2>생성 결과</h2>
          </div>

          <button
            className="icon-close"
            type="button"
            aria-label="생성 결과 닫기"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="result-tabs">
          <button
            className="active"
            type="button"
          >
            이메일
          </button>
        </div>

        <div className="document-paper">
          {isEditing ? (
            <textarea
              className="document-editor"
              value={editedText}
              onChange={(event) =>
                setEditedText(
                  event.target.value
                )
              }
            />
          ) : (
            <>
              <div className="document-meta-top">
                <span>AI 생성 문서</span>
                <span>사내 문서</span>
              </div>

              <h3>{document.title}</h3>

              <div className="mail-meta">
                <div>
                  <span>받는 사람</span>
                  <strong>
                    {document.to}
                  </strong>
                </div>

                <div>
                  <span>제목</span>
                  <strong>
                    {document.subject}
                  </strong>
                </div>
              </div>

              <div className="document-body">
                {document.greeting && (
                  <p>
                    {document.greeting}
                  </p>
                )}

                {(document.paragraphs || []).map(
                  (paragraph, index) => (
                    <p
                      key={`${paragraph}-${index}`}
                    >
                      {paragraph}
                    </p>
                  )
                )}

                {document.closing && (
                  <p>
                    {document.closing}
                  </p>
                )}

                {document.signature && (
                  <strong className="signature">
                    {document.signature}
                  </strong>
                )}
              </div>
            </>
          )}
        </div>

        <div className="result-actions">
          <div className="action-group">
            <button
              type="button"
              onClick={handleEditToggle}
            >
              ✎{" "}
              {isEditing
                ? "수정 완료"
                : "수정"}
            </button>

            <button
              type="button"
              onClick={handleCopy}
            >
              ▣ 복사
            </button>

            <div className="download-menu">
              <button type="button">
                ⇩ PDF/파일
              </button>

              <div className="download-options">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                >
                  PDF로 인쇄
                </button>

                <button
                  type="button"
                  onClick={handleDownloadText}
                >
                  TXT 파일 저장
                </button>
              </div>
            </div>
          </div>

          <button
            className="save-button"
            type="button"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
