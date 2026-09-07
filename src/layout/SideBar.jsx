import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/assistant", label: "AI 업무 비서" },
  { to: "/official", label: "공식 문서 생성기" },
  { to: "/analysis", label: "문서 분석기" },
  { to: "/editor", label: "AI 문서 편집기" },
  { to: "/archive", label: "문서 보관함" },
];

export default function SideBar({ onNavigate }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}
            to={to}
            onClick={onNavigate}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
