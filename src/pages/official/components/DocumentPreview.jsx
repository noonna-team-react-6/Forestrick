import { findType } from "../Mock";
import "./DocumentPreview.css";

const COMPANY_NAME = "노나 주식회사";

function FieldList({ fields, type, highlight }) {
  return (
    <dl className={highlight ? "preview-fields preview-fields--highlight" : "preview-fields"}>
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

function Signature({ fields, show, stampImage }) {
  if (!show && !stampImage) return null;

  return (
    <div className="preview-sign">
      {show ? (
        <>
          <p className="preview-sign__dept">{fields.department || "담당 부서"}</p>
          <p className="preview-sign__name">
            {fields.signerName || "담당자"}
            {stampImage ? (
              <img className="preview-sign__stamp-img" src={stampImage} alt="도장" />
            ) : (
              <span className="preview-sign__stamp">(인)</span>
            )}
          </p>
        </>
      ) : (
        <img className="preview-sign__stamp-img" src={stampImage} alt="도장" />
      )}
    </div>
  );
}

function PaperHeader({ companyStyle, type }) {
  return (
    <header className="preview-header">
      {companyStyle ? <p className="preview-company">{COMPANY_NAME}</p> : null}
      <h2 className="preview-title">{type.title}</h2>
    </header>
  );
}

export default function DocumentPreview({
  documentType,
  fields,
  body,
  companyStyle,
  showSignature,
  stampImage,
  editing,
  onBodyChange,
}) {
  const type = findType(documentType);
  const template = type.template ?? "notice";
  const paragraphs = String(body || "")
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <article
      className={`preview-paper preview-paper--${template} preview-template--${type.previewTemplateId ?? "classic"}`}
      data-template={type.template}
      data-template-id={type.previewTemplateId}
    >
      <PaperHeader companyStyle={companyStyle} type={type} />

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

      <FieldList fields={fields} type={type} highlight={template === "notice"} />
      {fields.extra ? <p className="preview-extra">{fields.extra}</p> : null}
      <Signature fields={fields} show={showSignature} stampImage={stampImage} />
    </article>
  );
}
