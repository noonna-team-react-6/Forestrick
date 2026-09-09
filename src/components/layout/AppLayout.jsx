import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./layout.css";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Breadcrumb from "./Breadcrumb";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={isSidebarOpen ? "app-layout sidebar-open" : "app-layout"}>
      <NavBar onMenuClick={() => setIsSidebarOpen((isOpen) => !isOpen)} />
      <SideBar onNavigate={() => setIsSidebarOpen(false)} />
      <button
        className="sidebar-overlay"
        type="button"
        aria-label="메뉴 닫기"
        onClick={() => setIsSidebarOpen(false)}
      />
      <main className="content">
        <Breadcrumb />
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
