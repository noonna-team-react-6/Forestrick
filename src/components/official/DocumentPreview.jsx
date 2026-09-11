import { findType } from "../../data/official";
import "../../styles/official/DocumentPreview.css";

function FieldList({ fields, type, highlight }) {
  return (
    <dl
      className={
        highlight
          ? "preview-fields preview-fields--highlight"
          : "preview-fields"
      }
    >
      {type.fields
        .filter((field) => field.key !== "extra" && fields[field.key])
        .map((field) => (
          <div key={field.key} className="preview-fields__row">
            <dt>{field.label}</dt>
            <dd>{fields[field.key]}</dd>
          </div>
        ))}
    </dl>
  );
}

function Seal({ image }) {
  const className = ["preview-seal", image ? "preview-seal--image" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className}>
      {image ? (
        <img className="preview-seal__img" src={image} alt="도장" />
      ) : null}
      <span className="preview-sign__stamp">(인)</span>
    </span>
  );
}

function Signature({
  fields,
  showDepartment,
  showName,
  showStamp,
  stampImage,
  stampAtName,
}) {
  const showNameLine = showName || (showStamp && stampAtName);
  if (!showDepartment && !showNameLine) return null;

  return (
    <div className="preview-sign">
      {showDepartment ? (
        <p className="preview-sign__dept">{fields.department || "담당 부서"}</p>
      ) : null}
      {showNameLine ? (
        <p className="preview-sign__name">
          {showName ? fields.signerName || "담당자" : null}
          {showStamp && stampAtName ? <Seal image={stampImage} /> : null}
        </p>
      ) : null}
    </div>
  );
}

function PaperHeader({ companyStyle, companyName, type }) {
  return (
    <header className="preview-header">
      {companyStyle ? (
        <p className="preview-company">{companyName || "회사명"}</p>
      ) : null}
      <h2 className="preview-title">{type.title}</h2>
    </header>
  );
}

export default function DocumentPreview({
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
  editing,
  onBodyChange,
  previewTemplateId,
}) {
  const type = findType(documentType);
  const template = type.template ?? "notice";
  const templateId = previewTemplateId ?? type.previewTemplateId ?? "classic";
  const paragraphs = String(body || "")
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <article
      className={`preview-paper preview-paper--${template} preview-template--${templateId}`}
      data-template={type.template}
      data-template-id={templateId}
    >
      {showStamp && stampAtCenter && stampImage ? (
        <img
          className="preview-stamp-center"
          src={stampImage}
          alt=""
          aria-hidden="true"
        />
      ) : null}

      <PaperHeader
        companyStyle={companyStyle}
        companyName={companyName}
        type={type}
      />

      {editing ? (
        <textarea
          className="preview-editor"
          value={body}
          onChange={(event) => onBodyChange?.(event.target.value)}
          aria-label="문서 본문"
        />
      ) : (
        <div className="preview-body">
          {paragraphs.length ? (
            paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
            ))
          ) : (
            <p className="preview-body__empty">작성된 본문이 없습니다.</p>
          )}
        </div>
      )}

      <FieldList
        fields={fields}
        type={type}
        highlight={template === "notice"}
      />
      {fields.extra ? <p className="preview-extra">{fields.extra}</p> : null}
      <Signature
        fields={fields}
        showDepartment={showDepartment}
        showName={showSignature}
        showStamp={showStamp}
        stampImage={stampImage}
        stampAtName={stampAtName}
      />
    </article>
  );
}
