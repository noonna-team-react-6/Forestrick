import Button from "../common/Button";
import {
  IconCopy,
  IconDownload,
  IconFile,
  IconPencil,
  IconPrint,
} from "../common/Icons";
import DocumentPreview from "./DocumentPreview";
import { ToneButtons } from "./DocumentTone";
import "./OfficialPreviewPane.css";

export default function OfficialPreviewPane({
  editing,
  onToggleEditing,
  onCopy,
  onPrint,
  onFile,
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
  tone,
  onRewrite,
  loading,
}) {
  return (
    <section className="official-pane official-pane--preview">
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
          <Button variant="outline" size="sm" onClick={onCopy}>
            <IconCopy size={16} />
            복사
          </Button>
          <Button variant="outline" size="sm" onClick={onPrint}>
            <IconPrint size={16} />
            인쇄
          </Button>
          <Button variant="outline" size="sm" onClick={onFile}>
            <IconFile size={16} />
            파일
          </Button>
          <Button variant="primary" size="sm" onClick={onSave}>
            <IconDownload size={16} />
            저장
          </Button>
        </div>
      </div>

      <div className="official-preview-stage">
        <DocumentPreview
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
        />
      </div>

      <div className="official-rewrite">
        <p className="official-rewrite__label">다른 스타일로 다시 작성</p>
        <ToneButtons value={tone} onChange={onRewrite} disabled={loading} />
      </div>
    </section>
  );
}
