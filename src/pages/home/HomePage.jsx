import { NavLink } from "react-router-dom";
import { IconArchive, IconCalendar, IconFile, IconScan, IconWand } from "../../components/common/Icons";
import useDocuments from "../../hooks/useDocuments";
import "./HomePage.css";

const workspaceItems = [
  {
    to: "/assistant",
    title: "AI 업무 비서",
    description: "자연어로 업무를 입력하면 필요한 정보를 구조화하고 다음 행동을 제안해요.",
    Icon: IconCalendar,
  },
  {
    to: "/official",
    title: "공식 문서 생성기",
    description: "회사 업무에 필요한 공문과 안내문을 빠르게 작성해요.",
    Icon: IconFile,
  },
  {
    to: "/analysis",
    title: "문서 분석기",
    description: "문서 속 핵심 정보와 업무를 AI가 찾아 정리해요.",
    Icon: IconScan,
  },
  {
    to: "/editor",
    title: "AI 문서 편집기",
    description: "비즈니스 문장을 더 정확하고 자연스럽게 다듬어 보세요.",
    Icon: IconWand,
  },
  {
    to: "/archive",
    title: "문서 보관함",
    description: "생성한 문서를 한곳에서 관리하고 다시 활용해요.",
    Icon: IconArchive,
  },
];

export default function HomePage() {
  const { documents } = useDocuments();
  const recentDocuments = documents.slice(0, 3);

  return (
    <section className="home-page">
      <header className="home-page__hero">
        <div className="home-page__brand-icon">
          <IconFile size={30} />
        </div>
        <div>
          <h1>Forestrick</h1>
          <span>AI WORKSPACE</span>
          <p>Forestrick은 문서 작성부터 업무 관리까지 연결하는 AI 기반 통합 서비스입니다.</p>
        </div>
      </header>

      <div className="home-page__grid">
        {workspaceItems.map(({ to, title, description, Icon }) => (
          <NavLink key={to} className="home-page__card" to={to}>
            <span className="home-page__card-icon">
              <Icon size={22} />
            </span>
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="home-page__card-link">
              바로가기 <span aria-hidden="true">›</span>
            </span>
          </NavLink>
        ))}
      </div>

      <section className="home-page__recent" aria-labelledby="recent-documents-title">
        <div className="home-page__recent-heading">
          <div>
            <span>RECENT DOCUMENTS</span>
            <h2 id="recent-documents-title">최근 작업한 문서</h2>
          </div>
          <NavLink to="/archive">
            전체 보기 <span aria-hidden="true">›</span>
          </NavLink>
        </div>

        {recentDocuments.length ? (
          <div className="home-page__recent-list">
            {recentDocuments.map((document) => (
              <NavLink key={document.id} to="/archive">
                <span className="home-page__recent-icon">
                  <IconFile size={18} />
                </span>
                <span>
                  <strong>{document.title}</strong>
                  <small>{document.category ?? document.type ?? "문서"} · 최근 수정</small>
                </span>
                <span aria-hidden="true">›</span>
              </NavLink>
            ))}
          </div>
        ) : (
          <p className="home-page__recent-empty">
            아직 저장한 문서가 없어요. 문서를 만들면 여기에 최근 작업이 표시돼요.
          </p>
        )}
      </section>
    </section>
  );
}
