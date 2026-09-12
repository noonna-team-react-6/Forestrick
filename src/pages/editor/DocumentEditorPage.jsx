import { useState } from "react";
import { useAI } from "../../hooks/useAI";

import Button from "../../components/common/Button";
import ModalFrame from "../../components/common/ModalFrame";
import Loading from "../../components/common/Loading";

import {
  IconSparkles,
  IconCopy,
  IconCheck,
} from "../../components/common/Icons";

import { documents } from "../../data/documents";
import { EDIT_OPTIONS } from "../../data/constants";

import "./DocumentEditorPage.css";

import EditOptions from "./EditOptions";
import EditHistory from "./EditHistory";

function DocumentEditorPage() {
  const { generate, loading } = useAI(
    import.meta.env.VITE_AI_PROVIDER || "gemini",
  );

  const document = documents[0];

  const [content, setContent] = useState(document.content);
  const [result, setResult] = useState("");
  const [selectedAction, setSelectedAction] = useState("문장 다듬기");
  const [isApplied, setIsApplied] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [previousContent, setPreviousContent] = useState("");

  const handleAction = async (action) => {
    setSelectedAction(action);
    setIsApplied(false);

    const selectedOption = Object.values(EDIT_OPTIONS)
      .flat()
      .find((option) => option.label === action);

    if (!selectedOption) return;

    const prompt = `
    [TASK:EDIT_TEXT]
    당신은 전문적인 AI 문서 편집기입니다.

    사용자가 입력한 문장의 의미와 핵심 정보는 유지해야 합니다.

    편집 요청:
    ${selectedOption.prompt}

    원문:
    ${content}

    수정된 문장만 출력하세요.
    설명이나 따옴표는 붙이지 마세요.
  `;

    try {
      setResult("");

      const aiResult = await generate(prompt);

      setResult(aiResult);

      setHistory((prev) => [
        {
          id: Date.now(),
          action,
          result: aiResult,
          time: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("AI 요청 실패:", err);
    }
  };

  // AI 결과를 원문에 적용
  const handleApply = () => {
    // 적용하기 전 원문 저장
    setPreviousContent(content);

    // AI 결과를 원문에 적용
    setContent(result);

    setIsApplied(true);
  };

  const handleUndo = () => {
    setContent(previousContent);
    setIsApplied(false);
  };

  // AI 결과를 클립보드에 복사
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
  };

  const handleHistorySelect = (item) => {
    setSelectedHistory(item);
    setIsHistoryModalOpen(true);
  };

  const handleHistoryRestore = () => {
    if (!selectedHistory) return;

    setResult(selectedHistory.result);
    setSelectedAction(selectedHistory.action);
    setIsApplied(false);

    setHistory((prev) => [
      {
        id: Date.now(),
        action: `"${selectedHistory.action}" 기록으로 돌아가기`,
        result: selectedHistory.result,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);

    setIsHistoryModalOpen(false);
    setSelectedHistory(null);
  };
  const handleCustomRequest = async (request) => {
    if (!request.trim()) return;

    setSelectedAction("직접 요청");
    setIsApplied(false);
    setResult("");

    const prompt = `
    [TASK:EDIT_TEXT]
    당신은 전문적인 AI 문서 편집기입니다.

    사용자가 입력한 문서의 핵심 정보와 의미는 최대한 유지해야 합니다.

    원문:
    ${content}

    사용자의 추가 요청:
    ${request}

    위 요청에 따라 문서를 수정해 주세요.

    수정된 문장만 출력하세요.
    설명이나 따옴표는 붙이지 마세요.
  `;

    try {
      const aiResult = await generate(prompt);

      setResult(aiResult);

      setHistory((prev) => [
        {
          id: Date.now(),
          action: `직접 요청: ${request}`,
          result: aiResult,
          time: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("AI 요청 실패:", err);
    }
  };

  return (
    <div className="editor-page">
      {/* 페이지 제목 및 설명 */}
      <section className="editor-page-header">
        <div>
          {/* 현재 페이지 위치 */}
          <div className="editor-eyebrow">WORKSPACE &gt; AI 문서 편집기</div>

          <h1>AI 문서 편집기</h1>

          <p>비즈니스 문장을 더 정갈하고 자연스럽게 다듬어 보세요.</p>
        </div>

        {/* AI 사용 가능 상태 표시 */}
        <div className="ai-status">
          <span className="status-dot" />
          AI 준비 완료
        </div>
      </section>

      {/* 원문과 AI 결과를 나란히 표시 */}
      <section className="editor-grid">
        {/* 원문 입력 영역 */}
        <article className="editor-card">
          <div className="editor-card-header">
            <h2>원문</h2>

            {/* 입력된 원문의 글자 수 표시 */}
            <span className="character-count">{content.length}자</span>
          </div>

          {/* 사용자가 AI 편집을 원하는 원문 입력 */}
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsApplied(false);
            }}
            placeholder="예시) 다음 달부터 새로운 협업 시스템을 도입할 예정입니다. 모든 구성원은 사용 방법을 확인하고 사전에 필요한 준비를 완료해 주시기 바랍니다."
          />

          <div className="quick-edit-options">
            <Button
              variant="outline"
              size="sm"
              selected={selectedAction === "문장 다듬기"}
              onClick={() => handleAction("문장 다듬기")}
              disabled={loading || !content.trim()}
            >
              문장 다듬기
            </Button>

            <Button
              variant="outline"
              size="sm"
              selected={selectedAction === "더 정중하게"}
              onClick={() => handleAction("더 정중하게")}
              disabled={loading || !content.trim()}
            >
              더 정중하게
            </Button>

            <Button
              variant="outline"
              size="sm"
              selected={selectedAction === "영어"}
              onClick={() => handleAction("영어")}
              disabled={loading || !content.trim()}
            >
              영어
            </Button>
          </div>
        </article>

        {/* AI 편집 결과 영역 */}
        <article className="editor-card">
          <div className="editor-card-header">
            <h2>AI 편집 결과</h2>

            {/* AI가 추천한 결과임을 표시 */}
            <span className="ai-recommend">
              <IconSparkles size={12} />
              AI 추천
            </span>
          </div>

          {/* AI 결과 출력 영역 */}
          <div
            className={`editor-result ${
              !result && !loading ? "is-placeholder" : ""
            } ${loading ? "is-loading" : ""}`}
          >
            {loading ? (
              <Loading size="sm" />
            ) : result ? (
              result
            ) : (
              "편집 결과가 여기에 표시됩니다."
            )}
          </div>

          <div className="editor-result-actions">
            <Button
              variant="gradient"
              size="md"
              onClick={handleApply}
              disabled={loading || !result || isApplied}
            >
              {isApplied ? (
                <>
                  <IconCheck size={15} />
                  적용됨
                </>
              ) : (
                "적용하기"
              )}
            </Button>

            {isApplied && (
              <Button variant="outline" size="md" onClick={handleUndo}>
                되돌리기
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={handleCopy}
              disabled={loading || !result}
            >
              <IconCopy size={15} />
              복사
            </Button>
          </div>
        </article>
      </section>

      {/* 더 다양한 편집 옵션 */}
      <EditOptions
        selectedAction={selectedAction}
        onAction={handleAction}
        loading={loading}
        hasContent={!!content.trim()}
        onCustomRequest={handleCustomRequest}
      />

      <EditHistory history={history} onSelect={handleHistorySelect} />

      <ModalFrame
        open={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        closeIcon
        width="small"
      >
        <div className="history-restore-modal">
          <h2>편집 기록으로 돌아가기</h2>

          <p>이 편집 기록으로 돌아가시겠습니까?</p>

          <div className="history-restore-actions">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsHistoryModalOpen(false)}
            >
              취소
            </Button>

            <Button variant="gradient" size="md" onClick={handleHistoryRestore}>
              돌아가기
            </Button>
          </div>
        </div>
      </ModalFrame>
    </div>
  );
}

export default DocumentEditorPage;
