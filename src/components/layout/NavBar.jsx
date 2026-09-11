import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IconSearch } from "../common/Icons";
import LoginModal from "./LoginModal";

export default function NavBar({ onMenuClick }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogin(name) {
    setUserName(name);
    setIsLoginModalOpen(false);
  }

  function handleLogout() {
    setUserName("");
    setIsLoginModalOpen(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = searchQuery.trim();

    navigate(query ? `/archive?q=${encodeURIComponent(query)}` : "/archive");
    setIsMobileSearchOpen(false);
  }

  return (
    <>
      <header className={isMobileSearchOpen ? "navbar is-search-open" : "navbar"}>
        <button className="menu-button" type="button" aria-label="메뉴 열기" onClick={onMenuClick}>
          ☰
        </button>
        <NavLink className="navbar-brand" to="/">
          <img src="/forestrick-logo-transparent.png" alt="Forestrick" />
        </NavLink>
        <form className="nav-search" role="search" onSubmit={handleSearchSubmit}>
          <label className="sr-only" htmlFor="nav-search-input">
            내 문서 검색
          </label>
          <input
            id="nav-search-input"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="내 문서 검색"
          />
        </form>
        <button
          className="nav-search-toggle"
          type="button"
          aria-label={isMobileSearchOpen ? "검색창 닫기" : "문서 검색"}
          aria-expanded={isMobileSearchOpen}
          onClick={() => setIsMobileSearchOpen((isOpen) => !isOpen)}
        >
          <IconSearch size={18} />
        </button>
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
