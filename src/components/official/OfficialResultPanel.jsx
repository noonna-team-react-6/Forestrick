import { useState } from "react";

import { documentToPlainText } from "../../utils/documentUtils";
import {
  IconSparkles,
  IconPencil,
  IconCopy,
  IconDownload,
  IconPrint,
} from "../common/Icons";

export default function OfficialResultPanel({
  document,
  onCopy,
  onDownloadPdf,
  onDownloadText,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(
    documentToPlainText(document)
  );

  if (!document) {
    return (
      <article className="assistant-card analysis-card">
        <div className="empty-analysis">
          <div className="empty-icon">
            <IconSparkles size={20} />
          </div>
          <h2>결과가 여기에 보여요</h2>
          <p>수신, 제목, 핵심 내용을 입력하고 생성하기를 눌러보세요.</p>
        </div>
      </article>
    );
  }

  const documentText = isEditing
    ? editedText
    : documentToPlainText(document);

  const handleEditToggle = () => {
    setIsEditing((previousState) => !previousState);
  };

  const handleCopy = () => {
    onCopy(documentText);
  };

  const handleDownloadPdf = () => {
    onDownloadPdf(documentText);
  };

  const handleDownloadText = () => {
    onDownloadText(documentText);
  };

  const handleSave = () => {
    onSave(documentText);
  };

  return (
    <article className="assistant-card official-result-panel">
      <div className="analysis-header">
        <div>
          <span className="result-kicker">AI 생성 완료</span>
          <h2>생성 결과</h2>
        </div>
      </div>

      <div className="document-paper official-document-paper">
        {isEditing ? (
          <textarea
            className="document-editor"
            value={editedText}
            onChange={(event) => setEditedText(event.target.value)}
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
                <strong>{document.to}</strong>
              </div>

              <div>
                <span>제목</span>
                <strong>{document.subject}</strong>
              </div>
            </div>

            <div className="document-body">
              {document.greeting && <p>{document.greeting}</p>}

              {(document.paragraphs || []).map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))}

              {document.closing && <p>{document.closing}</p>}

              {document.signature && (
                <strong className="signature">{document.signature}</strong>
              )}
            </div>
          </>
        )}
      </div>

      <div className="result-actions">
        <div className="action-group">
          <button type="button" onClick={handleEditToggle}>
            <IconPencil size={14} />
            {isEditing ? "수정 완료" : "수정"}
          </button>

          <button type="button" onClick={handleCopy}>
            <IconCopy size={14} />
            복사
          </button>

          <button type="button" onClick={handleDownloadPdf}>
            <IconPrint size={14} />
            PDF
          </button>

          <button type="button" onClick={handleDownloadText}>
            <IconDownload size={14} />
            TXT
          </button>
        </div>

        <button className="save-button" type="button" onClick={handleSave}>
          저장
        </button>
      </div>
    </article>
  );
}
