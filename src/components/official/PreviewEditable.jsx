import "../../styles/official/PreviewEditable.css";

export default function PreviewEditable({
  editing,
  value,
  onChange,
  className,
  as = "p",
  multiline = false,
  placeholder = "",
  ariaLabel,
  prefix = "",
  suffix = "",
}) {
  const text = String(value ?? "");
  const classNames = [className, !text && !editing ? "is-placeholder" : ""]
    .filter(Boolean)
    .join(" ");

  if (editing) {
    const Editor = multiline ? "textarea" : "input";
    return (
      <Editor
        className={`${className || ""} preview-inline-editor`.trim()}
        value={text}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        rows={multiline ? 4 : undefined}
        onChange={(event) => onChange?.(event.target.value)}
      />
    );
  }

  if (!text && !placeholder) return null;

  const Tag = as;
  return (
    <Tag className={classNames}>
      {text ? `${prefix}${text}${suffix}` : placeholder}
    </Tag>
  );
}
