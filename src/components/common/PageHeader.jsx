import StatusBadge from "./StatusBadge";
import "./common.css";

export default function PageHeader({
  title,
  description,
  breadcrumb,
  status,
  tone = "dark",
  className = "",
}) {
  return (
    <header className={`ui-page-header ui-page-header--${tone} ${className}`.trim()}>
      <div>
        {breadcrumb && (
          <nav className="ui-page-header__breadcrumb" aria-label="현재 경로">
            WORKSPACE <span aria-hidden="true">›</span> {breadcrumb}
          </nav>
        )}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      <StatusBadge status={status} tone={tone} />
    </header>
  );
}
