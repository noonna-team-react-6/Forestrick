import { formatInvitationDate } from "../../hooks/official/applyFieldToBody";
import { stripFactList } from "../../hooks/official/proofreadBody";
import { forwardRef } from "react";
import PreviewEditable from "./PreviewEditable";
import "../../styles/official/ObituaryPreview.css";

function MourningRibbon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 80"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 28c-9-10-22-8-22 4 0 8 8 14 22 24 14-10 22-16 22-24 0-12-13-14-22-4z"
        fill="currentColor"
      />
      <path
        d="M24 46l-8 26 16-10 16 10-8-26"
        fill="currentColor"
      />
    </svg>
  );
}

function PlantAccent({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 180"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M62 8c-4 28-6 70-4 160"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M60 48c-18-8-30-4-34 10 12 2 24 12 34 24 8-16 22-26 34-22-6-12-16-16-34-12z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M62 96c-16-6-26-2-28 12 10 2 18 10 28 20 8-14 20-22 28-18-4-12-12-16-28-14z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M62 138c-12-4-20 0-22 10 8 2 14 8 22 16 6-10 14-16 22-14-2-10-10-14-22-12z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="62" cy="28" r="8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CornerBloom({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 90 90"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 72c8-18 22-32 46-40"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M28 58c-8-2-14 4-12 12 6 0 12 4 16 10 4-8 12-14 20-14-6-8-14-10-24-8z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M52 36c-8-2-12 4-10 12 6 0 10 4 14 10 4-8 12-12 18-12-4-8-12-12-22-10z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M22 70c2-8 8-10 14-8"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function ObituaryBody({ body, editing, onBodyChange }) {
  const text = stripFactList(body);
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);

  if (editing) {
    return (
      <textarea
        className="obituary-editor"
        value={body}
        onChange={(event) => onBodyChange?.(event.target.value)}
        aria-label="부고 문구"
      />
    );
  }

  if (!paragraphs.length) {
    return <p className="obituary-body is-placeholder">부고 문구가 없습니다.</p>;
  }

  return (
    <div className="obituary-body">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
      ))}
    </div>
  );
}

const ObituaryPreview = forwardRef(function ObituaryPreview(
  {
    fields,
    body,
    editing,
    onBodyChange,
    onFieldChange,
    previewTemplateId,
  },
  ref,
) {
  const templateId = previewTemplateId ?? "classic";
  const deceasedName = String(fields.deceasedName ?? "").trim();
  const relationship = String(fields.relationship ?? "").trim();
  const funeralHome = String(fields.funeralHome ?? "").trim();
  const funeralDate = formatInvitationDate(fields.funeralDate);
  const background = String(fields.background ?? "").trim();
  const title = templateId === "minimal" ? "謹弔" : "訃告";
  const showFacts = editing || funeralHome || funeralDate;

  return (
    <article
      ref={ref}
      className={`preview-paper preview-paper--obituary preview-template--${templateId}${
        background ? " has-background" : ""
      }`}
      data-template="obituary"
      data-template-id={templateId}
    >
      {background ? (
        <img className="obituary-bg" src={background} alt="" />
      ) : null}
      <div className="obituary-bg-overlay" aria-hidden="true" />

      {templateId === "classic" ? (
        <PlantAccent className="obituary-plant" />
      ) : (
        <>
          <CornerBloom className="obituary-bloom obituary-bloom--tl" />
          <CornerBloom className="obituary-bloom obituary-bloom--br" />
        </>
      )}

      <p className="obituary-kicker">부고</p>
      <h2 className="obituary-title">{title}</h2>
      <MourningRibbon className="obituary-ribbon" />

      <ObituaryBody body={body} editing={editing} onBodyChange={onBodyChange} />

      {showFacts ? (
        <ul className="obituary-facts">
          {editing || funeralHome ? (
            <li>
              <span>빈소</span>
              <PreviewEditable
                editing={editing}
                as="strong"
                value={editing ? fields.funeralHome ?? "" : funeralHome}
                onChange={(value) => onFieldChange?.("funeralHome", value)}
                placeholder="빈소"
                ariaLabel="빈소"
              />
            </li>
          ) : null}
          {editing || funeralDate ? (
            <li>
              <span>발인</span>
              <PreviewEditable
                editing={editing}
                as="strong"
                value={editing ? fields.funeralDate ?? "" : funeralDate}
                onChange={(value) => onFieldChange?.("funeralDate", value)}
                placeholder="발인"
                ariaLabel="발인"
              />
            </li>
          ) : null}
        </ul>
      ) : null}

      <PreviewEditable
        editing={editing}
        className="obituary-extra"
        multiline
        value={fields.extra ?? ""}
        onChange={(value) => onFieldChange?.("extra", value)}
        placeholder="추가 내용"
        ariaLabel="추가 내용"
      />

      <footer className="obituary-footer">
        {templateId === "classic" && funeralDate && !showFacts ? (
          <p className="obituary-footer__date">{funeralDate}</p>
        ) : null}
        <PreviewEditable
          editing={editing}
          className="obituary-footer__name"
          value={deceasedName}
          onChange={(value) => onFieldChange?.("deceasedName", value)}
          placeholder="故 고인 성함"
          ariaLabel="고인 성함"
          prefix={deceasedName ? "故 " : ""}
        />
        <PreviewEditable
          editing={editing}
          className="obituary-footer__relation"
          value={relationship}
          onChange={(value) => onFieldChange?.("relationship", value)}
          placeholder="관계"
          ariaLabel="관계"
        />
      </footer>
    </article>
  );
});

export default ObituaryPreview;
