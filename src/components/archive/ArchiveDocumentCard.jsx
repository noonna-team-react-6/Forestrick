import { IconFile, IconStar, IconStarFill } from "../common/Icons";

const priorityLabels = {
  none: "중요도 없음",
  normal: "중요도 보통",
  high: "중요도 최상",
};

export default function ArchiveDocumentCard({
  document,
  priority,
  onPriorityChange,
  onOpen,
}) {
  const isImportant = priority !== "none";
  const StarIcon = priority === "high" ? IconStarFill : IconStar;
  const category = document.category ?? document.type ?? "문서";
  const updatedAt = document.updatedAt ?? document.createdAt ?? "방금 전";

  return (
    <article className="archive-document-card">
      <button
        className="archive-document-card__open"
        type="button"
        aria-label={`${document.title} 문서 열기`}
        onClick={onOpen}
      >
        <span className="archive-document-card__icon">
          <IconFile size={20} />
        </span>

        <span className="archive-document-card__category">{category}</span>
        <h2>{document.title}</h2>
        <p>최근 수정 · {updatedAt}</p>
      </button>
      <button
        className={`archive-document-card__priority archive-document-card__priority--${priority}`}
        type="button"
        aria-label={`${document.title} ${priorityLabels[priority]}`}
        title={`${priorityLabels[priority]} · 클릭하여 변경`}
        onClick={onPriorityChange}
      >
        <StarIcon size={20} />
        <span className="sr-only">{isImportant ? priorityLabels[priority] : "중요도 설정"}</span>
      </button>
    </article>
  );
}
