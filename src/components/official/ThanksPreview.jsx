import { stripFactList } from "../../hooks/official/proofreadBody";
import { forwardRef } from "react";
import PreviewEditable from "./PreviewEditable";
import "../../styles/official/ThanksPreview.css";

function FloralSpray({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 90 160"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M28 150c8-36 10-70 6-132"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M32 48c-14-6-22 0-24 12 10 2 18 10 26 20 6-14 18-22 28-18-6-12-16-16-30-14z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M34 86c-12-4-18 2-18 12 8 2 14 8 20 16 6-12 16-18 24-14-4-10-12-14-26-14z"
        fill="currentColor"
        opacity="0.7"
      />
      <circle cx="36" cy="28" r="10" fill="currentColor" opacity="0.9" />
      <circle cx="52" cy="118" r="7" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

function CornerBloom({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 88 88"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 70c10-18 24-32 50-42"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="28" cy="58" r="11" fill="currentColor" />
      <circle cx="48" cy="40" r="8" fill="currentColor" opacity="0.8" />
      <path
        d="M18 68c6-10 14-12 22-8"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function GiftBow({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 18c40-14 70-8 86 8 16-16 46-22 86-8"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M90 10c-16 2-24 14-16 22 10-2 16-6 16-12 0 6 6 10 16 12 8-8 0-20-16-22z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoldSeal({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      aria-hidden="true"
    >
      <circle cx="36" cy="36" r="30" fill="#d4b15a" />
      <circle cx="36" cy="36" r="24" fill="none" stroke="#f7e7b4" strokeWidth="2" />
      <text
        x="36"
        y="40"
        textAnchor="middle"
        fill="#fffaf0"
        fontSize="12"
        fontFamily="serif"
      >
        감사
      </text>
    </svg>
  );
}

function ThanksBody({ body, editing, onBodyChange }) {
  const text = stripFactList(body);
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);

  if (editing) {
    return (
      <textarea
        className="thanks-editor"
        value={body}
        onChange={(event) => onBodyChange?.(event.target.value)}
        aria-label="감사장 문구"
      />
    );
  }

  if (!paragraphs.length) {
    return <p className="thanks-body is-placeholder">감사 문구가 없습니다.</p>;
  }

  return (
    <div className="thanks-body">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
      ))}
    </div>
  );
}

const ThanksPreview = forwardRef(function ThanksPreview(
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
  const recipient = String(fields.recipient ?? "").trim();
  const senderName = String(fields.senderName ?? fields.signerName ?? "").trim();
  const reason = String(fields.reason ?? "").trim();
  const background = String(fields.background ?? "").trim();
  const title =
    templateId === "modern"
      ? "Thank you!"
      : templateId === "minimal"
        ? "감 사 장"
        : "감사드립니다";

  return (
    <article
      ref={ref}
      className={`preview-paper preview-paper--thanks preview-template--${templateId}${
        background ? " has-background" : ""
      }`}
      data-template="thanks"
      data-template-id={templateId}
    >
      {background ? (
        <img className="thanks-bg" src={background} alt="" />
      ) : null}
      <div className="thanks-bg-overlay" aria-hidden="true" />

      {templateId === "classic" ? (
        <>
          <CornerBloom className="thanks-bloom thanks-bloom--tl" />
          <CornerBloom className="thanks-bloom thanks-bloom--br" />
        </>
      ) : null}

      {templateId === "modern" ? (
        <>
          <FloralSpray className="thanks-spray thanks-spray--left" />
          <FloralSpray className="thanks-spray thanks-spray--right" />
          <GiftBow className="thanks-bow" />
        </>
      ) : null}

      <div className="thanks-frame">
        <h2 className="thanks-title">{title}</h2>
        <PreviewEditable
          editing={editing}
          className="thanks-reason"
          value={reason}
          onChange={(value) => onFieldChange?.("reason", value)}
          placeholder="감사 사유"
          ariaLabel="감사 사유"
        />

        <PreviewEditable
          editing={editing}
          className="thanks-to"
          value={recipient}
          onChange={(value) => onFieldChange?.("recipient", value)}
          placeholder="수신"
          ariaLabel="수신"
          suffix={recipient && templateId !== "modern" && !editing ? "께" : ""}
          prefix={
            recipient && templateId === "modern" && !editing ? "TO. " : ""
          }
        />

        <ThanksBody body={body} editing={editing} onBodyChange={onBodyChange} />

        <PreviewEditable
          editing={editing}
          className="thanks-extra"
          multiline
          value={fields.extra ?? ""}
          onChange={(value) => onFieldChange?.("extra", value)}
          placeholder="추가 내용"
          ariaLabel="추가 내용"
        />

        <footer className="thanks-footer">
          {templateId === "minimal" ? <GoldSeal className="thanks-seal" /> : null}
          <PreviewEditable
            editing={editing}
            className="thanks-from"
            value={senderName}
            onChange={(value) => onFieldChange?.("senderName", value)}
            placeholder="보내는 이"
            ariaLabel="보내는 이"
            prefix={
              senderName && templateId === "modern" && !editing ? "FROM. " : ""
            }
          />
        </footer>
      </div>
    </article>
  );
});

export default ThanksPreview;
