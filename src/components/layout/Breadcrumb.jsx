import { NavLink, useLocation } from "react-router-dom";

const pageLabels = {
  "/": "홈",
  "/assistant": "AI 업무 비서",
  "/official": "공식 문서 생성기",
  "/analysis": "문서 분석기",
  "/editor": "AI 문서 편집기",
  "/archive": "문서 보관함",
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const pageLabel = pageLabels[pathname] ?? "페이지";

  return (
    <nav className="breadcrumb" aria-label="현재 경로">
      <NavLink to="/">WORKSPACE</NavLink>
      <span aria-hidden="true">›</span>
      <span>{pageLabel}</span>
    </nav>
  );
}
