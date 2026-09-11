import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArchiveDocumentCard from "../../components/archive/ArchiveDocumentCard";
import { IconPlus, IconSearch } from "../../components/common/Icons";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import useDocuments from "../../hooks/useDocuments";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getAIStatus } from "../../utils/aiStatus";
import "./DocumentArchivePage.css";

const nextPriority = {
  none: "normal",
  normal: "high",
  high: "none",
};

const previewDocuments = [
  {
    id: "preview-event-guide",
    title: "신제품 출시 기념 행사 안내",
    category: "행사 안내",
    source: "official",
    updatedAt: "방금 전",
  },
  {
    id: "preview-weekly-meeting",
    title: "주간 업무 회의록",
    category: "회의록",
    source: "assistant",
    updatedAt: "오늘",
  },
];

export default function DocumentArchivePage() {
  const navigate = useNavigate();
  const { documents } = useDocuments();
  const [activeTab, setActiveTab] = useState("my-documents");
  const [query, setQuery] = useState("");
  const [priorities, setPriorities] = useLocalStorage("forestrick-document-priorities", {});
  const archiveDocuments = documents.length ? documents : previewDocuments;

  const favoriteCount = archiveDocuments.filter(
    (document) => priorities[document.id] && priorities[document.id] !== "none",
  ).length;

  const visibleDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return archiveDocuments.filter((document) => {
      const category = document.category ?? document.type ?? "문서";
      const matchesTab = activeTab === "my-documents" || priorities[document.id] !== undefined;
      const matchesSearch =
        !normalizedQuery ||
        document.title.toLowerCase().includes(normalizedQuery) ||
        category.toLowerCase().includes(normalizedQuery);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, archiveDocuments, priorities, query]);

  function handlePriorityChange(documentId) {
    setPriorities((currentPriorities) => {
      const currentPriority = currentPriorities[documentId] ?? "none";
      const updatedPriority = nextPriority[currentPriority];

      if (updatedPriority === "none") {
        const remainingPriorities = { ...currentPriorities };
        delete remainingPriorities[documentId];
        return remainingPriorities;
      }

      return { ...currentPriorities, [documentId]: updatedPriority };
    });
  }

  return (
    <section className="document-archive">
      <PageHeader
        breadcrumb="문서 보관함"
        title="문서 보관함"
        description="생성한 문서와 업무 기록을 한곳에서 다시 활용해요."
        status={getAIStatus()}
      />

      <Panel className="document-archive__panel">
        <div className="document-archive__toolbar">
          <label className="document-archive__search">
            <IconSearch size={19} />
            <span className="sr-only">문서 제목으로 검색</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="문서 제목으로 검색"
            />
          </label>
          <button className="document-archive__create-button" type="button" onClick={() => navigate("/official")}>
            <IconPlus size={18} />
            새 문서 만들기
          </button>
        </div>

        <div className="document-archive__tabs" role="tablist" aria-label="문서 보기">
          <button
            className={activeTab === "my-documents" ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === "my-documents"}
            onClick={() => setActiveTab("my-documents")}
          >
            내 문서
          </button>
          <button
            className={activeTab === "favorites" ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
          >
            즐겨찾기 <span>{favoriteCount}</span>
          </button>
        </div>

        {visibleDocuments.length ? (
          <div className="document-archive__grid">
            {visibleDocuments.map((document) => (
              <ArchiveDocumentCard
                key={document.id}
                document={document}
                priority={priorities[document.id] ?? "none"}
                onPriorityChange={() => handlePriorityChange(document.id)}
              />
            ))}
          </div>
        ) : (
          <p className="document-archive__empty">
            {activeTab === "favorites"
              ? "즐겨찾기한 문서가 없어요."
              : query
                ? "검색 결과가 없어요."
                : "저장된 문서가 없어요."}
          </p>
        )}
      </Panel>
    </section>
  );
}
