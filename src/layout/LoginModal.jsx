import { useState } from "react";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [registerMessage, setRegisterMessage] = useState("");

  if (!isOpen) return null;

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onLogin(formData.get("name"));
  }

  return (
    <div className="login-modal-layer">
      <button className="login-modal-overlay" type="button" aria-label="로그인 창 닫기" onClick={onClose} />

      <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <button className="modal-close-button" type="button" aria-label="로그인 창 닫기" onClick={onClose}>
          ×
        </button>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2 id="login-modal-title">로그인</h2>

          <label htmlFor="login-name">이름</label>
          <input id="login-name" name="name" required />

          <label htmlFor="login-email">이메일</label>
          <input id="login-email" name="email" type="email" required />

          <label htmlFor="login-password">비밀번호</label>
          <input id="login-password" name="password" type="password" required />

          <button className="login-submit-button" type="submit">로그인</button>
          <button
            className="register-button"
            type="button"
            onClick={() => setRegisterMessage("회원가입 기능은 준비 중입니다.")}
          >
            회원가입
          </button>
          {registerMessage && <p className="register-message">{registerMessage}</p>}
        </form>
      </section>
    </div>
  );
}
