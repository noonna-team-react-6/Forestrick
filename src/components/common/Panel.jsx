import "./common.css";

export default function Panel({ as: Component = "section", className = "", children, ...props }) {
  return (
    <Component className={`ui-panel ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
