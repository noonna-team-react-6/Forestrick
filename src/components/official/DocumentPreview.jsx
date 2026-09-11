import { findType } from "../../data/official";
import { stripFactList } from "../../hooks/official/proofreadBody";
import WeddingPreview from "./WeddingPreview";
import ObituaryPreview from "./ObituaryPreview";
import ThanksPreview from "./ThanksPreview";
import PreviewEditable from "./PreviewEditable";
import "../../styles/official/DocumentPreview.css";

function FieldList({ fields, type, highlight, editing, onFieldChange }) {
  const rows = type.fields.filter(
    (field) =>
      field.key !== "extra" &&
      field.type !== "image" &&
      (editing || fields[field.key]),
  );

  if (!rows.length) return null;

  return (
    <dl
      className={
        highlight
          ? "preview-fields preview-fields--highlight"
          : "preview-fields"
      }
    >
      {rows.map((field) => (
        <div key={field.key} className="preview-fields__row">
          <dt>{field.label}</dt>
          <dd>
            {editing ? (
              <PreviewEditable
                editing
                value={fields[field.key] ?? ""}
                onChange={(value) => onFieldChange?.(field.key, value)}
                placeholder={field.label}
                ariaLabel={field.label}
                multiline={Boolean(field.multiline)}
              />
            ) : (
              fields[field.key]
            )}
          </dd>
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
  editing,
  onFieldChange,
}) {
  const showNameLine = showName || (showStamp && stampAtName);
  if (!showDepartment && !showNameLine) return null;

  return (
    <div className="preview-sign">
      {showDepartment ? (
        editing ? (
          <PreviewEditable
            editing
            className="preview-sign__dept"
            value={fields.department ?? ""}
            onChange={(value) => onFieldChange?.("department", value)}
            placeholder="담당 부서"
            ariaLabel="담당 부서"
          />
        ) : (
          <p className="preview-sign__dept">{fields.department || "담당 부서"}</p>
        )
      ) : null}
      {showNameLine ? (
        <p className="preview-sign__name">
          {showName ? (
            editing ? (
              <PreviewEditable
                editing
                value={fields.signerName ?? ""}
                onChange={(value) => onFieldChange?.("signerName", value)}
                placeholder="담당자"
                ariaLabel="이름"
              />
            ) : (
              fields.signerName || "담당자"
            )
          ) : null}
          {showStamp && stampAtName ? <Seal image={stampImage} /> : null}
        </p>
      ) : null}
    </div>
  );
}

function mergeBodyAndExtra(body, extra) {
  const main = stripFactList(body);
  const note = String(extra ?? "").trim();
  if (!note || main.includes(note)) return main;
  return main ? `${main}\n\n${note}` : note;
}

function PaperHeader({
  companyStyle,
  companyName,
  type,
  editing,
  onCompanyNameChange,
}) {
  return (
    <header className="preview-header">
      {companyStyle ? (
        editing ? (
          <PreviewEditable
            editing
            className="preview-company"
            value={companyName ?? ""}
            onChange={onCompanyNameChange}
            placeholder="회사명"
            ariaLabel="회사명"
          />
        ) : (
          <p className="preview-company">{companyName || "회사명"}</p>
        )
      ) : null}
      <h2 className="preview-title">{type.title}</h2>
    </header>
  );
}

const cardProps = (props) => ({
  fields: props.fields,
  body: props.body,
  editing: props.editing,
  onBodyChange: props.onBodyChange,
  onFieldChange: props.onFieldChange,
  previewTemplateId: props.previewTemplateId,
});

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
  onFieldChange,
  onCompanyNameChange,
  previewTemplateId,
  paperRef,
}) {
  const type = findType(documentType);
  const template = type.template ?? "notice";
  const templateId = previewTemplateId ?? type.previewTemplateId ?? "classic";
  const shared = {
    fields,
    body,
    editing,
    onBodyChange,
    onFieldChange,
    previewTemplateId: templateId,
  };

  if (documentType === "wedding") {
    return <WeddingPreview {...cardProps(shared)} ref={paperRef} />;
  }

  if (documentType === "obituary") {
    return <ObituaryPreview {...cardProps(shared)} ref={paperRef} />;
  }

  if (documentType === "thanks") {
    return <ThanksPreview {...cardProps(shared)} ref={paperRef} />;
  }

  const paragraphs = mergeBodyAndExtra(body, fields.extra)
    .split(/\n{2,}/)
    .filter(Boolean);

  return (
    <article
      ref={paperRef}
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
        editing={editing}
        onCompanyNameChange={onCompanyNameChange}
      />

      {editing ? (
        <PreviewEditable
          editing
          className="preview-editor"
          multiline
          value={body}
          onChange={onBodyChange}
          placeholder="본문을 입력해 주세요."
          ariaLabel="문서 본문"
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
        editing={editing}
        onFieldChange={onFieldChange}
      />
      <Signature
        fields={fields}
        showDepartment={showDepartment}
        showName={showSignature}
        showStamp={showStamp}
        stampImage={stampImage}
        stampAtName={stampAtName}
        editing={editing}
        onFieldChange={onFieldChange}
      />
    </article>
  );
}
