import { formatInvitationDate } from "../../hooks/official/applyFieldToBody";
import { stripFactList } from "../../hooks/official/proofreadBody";
import { forwardRef } from "react";
import PreviewEditable from "./PreviewEditable";
import "../../styles/official/WeddingPreview.css";

function FloralAccent({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 240"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M36 18c-8 22-10 48-8 78s8 52 8 126"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M36 70c-16-8-24-4-28 8 10 2 20 10 28 22 6-14 18-24 28-22-4-12-12-16-28-8z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M36 128c-14-6-22-2-24 10 8 2 16 8 24 18 6-12 16-20 24-18-2-12-10-16-24-10z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="36" cy="42" r="10" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="36" cy="42" r="3.5" fill="currentColor" />
      <circle cx="22" cy="96" r="7" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="50" cy="158" r="7" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function WeddingPhoto({ src, shape }) {
  if (src) {
    return (
      <div className={`wedding-photo wedding-photo--${shape}`}>
        <img src={src} alt="웨딩 사진" />
      </div>
    );
  }

  return (
    <div
      className={`wedding-photo wedding-photo--${shape} wedding-photo--empty`}
    >
      <span>웨딩 사진을 넣어 주세요</span>
    </div>
  );
}

function WeddingBody({ body, editing, onBodyChange }) {
  const poem = stripFactList(body);
  const paragraphs = poem.split(/\n{2,}/).filter(Boolean);

  if (editing) {
    return (
      <textarea
        className="wedding-editor"
        value={body}
        onChange={(event) => onBodyChange?.(event.target.value)}
        aria-label="청첩 문구"
      />
    );
  }

  if (!paragraphs.length) return null;

  return (
    <div className="wedding-poem">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
      ))}
    </div>
  );
}

function Names({ groomsName, bridesName, layout, editing, onFieldChange }) {
  if (editing) {
    return (
      <div
        className={
          layout === "inline"
            ? "wedding-names wedding-names--inline"
            : "wedding-names"
        }
      >
        <PreviewEditable
          editing
          className="wedding-name"
          value={groomsName}
          onChange={(value) => onFieldChange?.("groomsName", value)}
          placeholder="신랑"
          ariaLabel="신랑"
        />
        {layout === "inline" ? (
          <span className="wedding-diamond" aria-hidden="true">
            ◆
          </span>
        ) : (
          <p className="wedding-and">그리고</p>
        )}
        <PreviewEditable
          editing
          className="wedding-name"
          value={bridesName}
          onChange={(value) => onFieldChange?.("bridesName", value)}
          placeholder="신부"
          ariaLabel="신부"
        />
      </div>
    );
  }

  const groom = groomsName || "신랑";
  const bride = bridesName || "신부";

  if (layout === "inline") {
    return (
      <p className="wedding-names wedding-names--inline">
        <span className={!groomsName ? "is-placeholder" : undefined}>
          {groom}
        </span>
        <span className="wedding-diamond" aria-hidden="true">
          ◆
        </span>
        <span className={!bridesName ? "is-placeholder" : undefined}>
          {bride}
        </span>
      </p>
    );
  }

  return (
    <div className="wedding-names">
      <p className={`wedding-name ${groomsName ? "" : "is-placeholder"}`}>
        {groom}
      </p>
      <p className="wedding-and">그리고</p>
      <p className={`wedding-name ${bridesName ? "" : "is-placeholder"}`}>
        {bride}
      </p>
    </div>
  );
}

const WeddingPreview = forwardRef(function WeddingPreview(
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
  const groomsName = String(fields.groomsName ?? "").trim();
  const bridesName = String(fields.bridesName ?? "").trim();
  const photo = String(fields.photo ?? "").trim();
  const date = formatInvitationDate(fields.date);
  const names = {
    groomsName,
    bridesName,
    editing,
    onFieldChange,
  };

  return (
    <article
      ref={ref}
      className={`preview-paper preview-paper--wedding preview-template--${templateId}`}
      data-template="wedding"
      data-template-id={templateId}
    >
      {templateId === "classic" ? (
        <>
          <FloralAccent className="wedding-floral wedding-floral--left" />
          <FloralAccent className="wedding-floral wedding-floral--right" />
        </>
      ) : null}

      <p className="wedding-kicker">
        {templateId === "modern"
          ? "Wedding Day"
          : templateId === "minimal"
            ? "Invitation"
            : "Celebrate with us"}
      </p>

      {templateId === "classic" ? <Names {...names} /> : null}

      <WeddingPhoto
        src={photo}
        shape={templateId === "modern" ? "hex" : "frame"}
      />

      {templateId === "modern" ? (
        <Names {...names} layout="inline" />
      ) : null}

      {templateId === "minimal" ? <Names {...names} /> : null}

      <WeddingBody body={body} editing={editing} onBodyChange={onBodyChange} />

      <div className="wedding-meta">
        <PreviewEditable
          editing={editing}
          className="wedding-date"
          value={editing ? fields.date ?? "" : date}
          onChange={(value) => onFieldChange?.("date", value)}
          placeholder="예식 일시"
          ariaLabel="예식 일시"
        />
        <PreviewEditable
          editing={editing}
          className="wedding-venue"
          value={fields.venue ?? ""}
          onChange={(value) => onFieldChange?.("venue", value)}
          placeholder="예식 장소"
          ariaLabel="예식 장소"
        />
      </div>

      <PreviewEditable
        editing={editing}
        className="wedding-extra"
        multiline
        value={fields.extra ?? ""}
        onChange={(value) => onFieldChange?.("extra", value)}
        placeholder="추가 내용"
        ariaLabel="추가 내용"
      />
    </article>
  );
});

export default WeddingPreview;
