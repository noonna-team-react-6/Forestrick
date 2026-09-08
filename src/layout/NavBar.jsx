import { useState } from "react";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal";

export default function NavBar({ onMenuClick }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userName, setUserName] = useState("");

  function handleLogin(name) {
    setUserName(name);
    setIsLoginModalOpen(false);
  }

  function handleLogout() {
    setUserName("");
    setIsLoginModalOpen(false);
  }

  return (
    <>
      <header className="navbar">
        <button className="menu-button" type="button" aria-label="메뉴 열기" onClick={onMenuClick}>
          ☰
        </button>
        <NavLink className="navbar-brand" to="/">
          Forestrick
        </NavLink>
        <form className="nav-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="nav-search-input">
            문서와 업무 검색
          </label>
          <input id="nav-search-input" type="search" placeholder="문서와 업무 검색" />
        </form>
        {userName ? (
          <div className="navbar-actions logged-in-actions">
            <span>{userName}님, 반갑습니다.</span>
            <button className="logout-button" type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <button className="navbar-actions login-button" type="button" onClick={() => setIsLoginModalOpen(true)}>
            로그인
          </button>
        )}
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
    </>
  );
}
