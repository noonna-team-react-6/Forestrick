import { useRef, useState } from "react";
import Button from "../common/Button";
import { IconCopy, IconDownload, IconPencil, IconPrint } from "../common/Icons";
import Panel from "../common/Panel";
import { findType, isCardType, PREVIEW_TEMPLATES } from "../../data/official";
import { downloadElementAsPdf } from "../../utils/pdfExport";
import DocumentPreview from "./DocumentPreview";
import { ToneButtons } from "./DocumentTone";
import "../../styles/official/OfficialPreviewPane.css";

function getPreviewText(paper) {
  if (!paper) return "";

  const clone = paper.cloneNode(true);
  clone.querySelectorAll("input, textarea").forEach((el) => {
    el.replaceWith(document.createTextNode(el.value || ""));
  });
  clone.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());

  return clone.innerText
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function createA4ExportFrame(paper) {
  const frame = document.createElement("div");
  frame.setAttribute("data-official-pdf-frame", "");
  frame.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    "width:210mm",
    "height:297mm",
    "box-sizing:border-box",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "background:#ffffff",
    "overflow:hidden",
  ].join(";");

  const clone = paper.cloneNode(true);
  clone.style.boxShadow = "none";
  clone.style.maxWidth = "210mm";
  clone.style.maxHeight = "297mm";
  clone.querySelectorAll("input, textarea").forEach((el) => {
    el.replaceWith(document.createTextNode(el.value || ""));
  });
  clone.querySelectorAll("[contenteditable]").forEach((el) => {
    el.removeAttribute("contenteditable");
  });

  frame.appendChild(clone);
  document.body.appendChild(frame);
  return frame;
}

async function printPreviewPaper(paper, title) {
  const printWindow = window.open("", "_blank", "width=900,height=800");
  if (!printWindow) {
    throw new Error("팝업이 차단되어 인쇄할 수 없습니다.");
  }

  const clone = paper.cloneNode(true);
  clone.querySelectorAll("input, textarea").forEach((el) => {
    el.replaceWith(document.createTextNode(el.value || ""));
  });
  clone.querySelectorAll("[contenteditable]").forEach((el) => {
    el.removeAttribute("contenteditable");
  });

  const styles = [...document.querySelectorAll("style, link[rel='stylesheet']")]
    .map((node) => node.outerHTML)
    .join("\n");
  const safeTitle = String(title)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  printWindow.document.write(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    ${styles}
    <style>
      html, body { margin: 0; background: #fff; }
      body { display: flex; justify-content: center; padding: 16px; }
      .preview-paper { box-shadow: none !important; }
    </style>
  </head>
  <body>${clone.outerHTML}</body>
</html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onafterprint = () => printWindow.close();
  printWindow.print();
}

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
  const designOptions = (
    recommendedDesigns?.length
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
    const paper = paperRef.current;
    if (!paper) {
      onExportError?.("미리보기가 없습니다.");
      return;
    }

    setExporting(true);
    try {
      await printPreviewPaper(paper, fileTitle);
    } catch (err) {
      onExportError?.(err?.message || "인쇄에 실패했습니다.");
    } finally {
      setExporting(false);
    }
  };

  const handlePdf = async () => {
    const paper = paperRef.current;
    if (!paper) {
      onExportError?.("미리보기가 없습니다.");
      return;
    }

    setExporting(true);
    const frame = createA4ExportFrame(paper);
    try {
      await downloadElementAsPdf(frame, { fileName: fileTitle });
      onCopySuccess?.("PDF를 저장했습니다.");
    } catch (err) {
      onExportError?.(err?.message || "PDF 저장에 실패했습니다.");
    } finally {
      frame.remove();
      setExporting(false);
    }
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
