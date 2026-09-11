import { useRef, useState } from "react";
import Button from "../common/Button";
import {
  IconCopy,
  IconDownload,
  IconPencil,
  IconPrint,
} from "../common/Icons";
import Panel from "../common/Panel";
import { findType, isCardType, PREVIEW_TEMPLATES } from "../../data/official";
import DocumentPreview from "./DocumentPreview";
import { ToneButtons } from "./DocumentTone";
import {
  getPreviewText,
  printPreviewPaper,
} from "../../utils/previewExport";
import "../../styles/official/OfficialPreviewPane.css";

export default function OfficialPreviewPane({
  editing,
  onToggleEditing,
  onCopySuccess,
  onExportError,
  onSave,
  documentType,
  fields,
  body,
  companyStyle,
  companyName,
  showDepartment,
  showSignature,
  showStamp,
  stampImage,
  stampAtCenter,
  stampAtName,
  onBodyChange,
  onFieldChange,
  onCompanyNameChange,
  tone,
  onRewrite,
  loading,
  previewTemplateId,
  onPreviewTemplateChange,
  showDesigns,
  recommendedDesigns,
}) {
  const paperRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const thumbKind = isCardType(documentType) ? documentType : "";
  const fileTitle = findType(documentType).title;
  const designOptions = (recommendedDesigns?.length
    ? recommendedDesigns
    : PREVIEW_TEMPLATES.map((item) => item.id)
  )
    .map((id) => PREVIEW_TEMPLATES.find((item) => item.id === id))
    .filter(Boolean);

  const handleCopy = async () => {
    try {
      const text = getPreviewText(paperRef.current);
      if (!text) {
        onExportError?.("복사할 글이 없습니다.");
        return;
      }
      await navigator.clipboard.writeText(text);
      onCopySuccess?.("미리보기 글을 복사했습니다.");
    } catch {
      onExportError?.("복사에 실패했습니다.");
    }
  };

  const handlePrint = async () => {
    setExporting(true);
    try {
      await printPreviewPaper(paperRef.current, { title: fileTitle });
    } catch (err) {
      onExportError?.(err?.message || "인쇄에 실패했습니다.");
    } finally {
      setExporting(false);
    }
  };

  const handlePdf = () => {
    onExportError?.(
      "PDF 저장 라이브러리를 제거해 지금은 파일을 받을 수 없습니다.",
    );
  };

  return (
    <Panel className="official-pane official-pane--preview">
      <div className="official-preview-head">
        <h2 className="official-pane__title">미리보기</h2>
        <div className="official-toolbar">
          <Button
            variant="outline"
            size="sm"
            selected={editing}
            onClick={onToggleEditing}
          >
            <IconPencil size={16} />
            수정
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <IconCopy size={16} />
            복사
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={exporting}
            onClick={handlePrint}
          >
            <IconPrint size={16} />
            인쇄
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={exporting}
            onClick={handlePdf}
          >
            <IconDownload size={16} />
            PDF
          </Button>
          <Button variant="primary" size="sm" onClick={onSave}>
            <IconDownload size={16} />
            저장
          </Button>
        </div>
      </div>

      {showDesigns ? (
        <div className="official-designs">
          <p className="official-designs__label">AI 추천 디자인</p>
          <div className="official-designs__list">
            {designOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  previewTemplateId === item.id
                    ? "official-designs__item is-active"
                    : "official-designs__item"
                }
                onClick={() => onPreviewTemplateChange(item.id)}
              >
                <span
                  className={`official-designs__thumb official-designs__thumb--${item.id}${
                    thumbKind ? ` official-designs__thumb--${thumbKind}` : ""
                  }`}
                  aria-hidden="true"
                />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="official-preview-stage">
        <DocumentPreview
          paperRef={paperRef}
          documentType={documentType}
          fields={fields}
          body={body}
          companyStyle={companyStyle}
          companyName={companyName}
          showDepartment={showDepartment}
          showSignature={showSignature}
          showStamp={showStamp}
          stampImage={stampImage}
          stampAtCenter={stampAtCenter}
          stampAtName={stampAtName}
          editing={editing}
          onBodyChange={onBodyChange}
          onFieldChange={onFieldChange}
          onCompanyNameChange={onCompanyNameChange}
          previewTemplateId={previewTemplateId}
        />
      </div>

      <div className="official-rewrite">
        <p className="official-rewrite__label">다른 스타일로 다시 작성</p>
        <ToneButtons value={tone} onChange={onRewrite} disabled={loading} />
      </div>
    </Panel>
  );
}
