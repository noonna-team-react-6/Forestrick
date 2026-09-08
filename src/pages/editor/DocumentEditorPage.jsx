import { useState } from "react";
import { useAI } from "../../hooks/useAI";

import Button from "../../components/common/Button";

import {
  IconSparkles,
  IconWand,
  IconCopy,
  IconCheck,
} from "../../components/common/Icons";

import "./DocumentEditorPage.css";

// AI 문서 편집기 페이지 컴포넌트
function DocumentEditorPage() {
  const { generate, loading } = useAI(
    import.meta.env.VITE_AI_PROVIDER || "gemini"
  );

  // 원문 / AI 결과 / 선택된 편집 기능 / 적용 상태
  const [content, setContent] = useState("");

  const [result, setResult] = useState("");

  const [selectedAction, setSelectedAction] =
    useState("문장 다듬기");

  const [isApplied, setIsApplied] = useState(false);

  // AI 편집 기능 목록
  const actions = [
    "문장 다듬기",
    "더 정중하게",
    "격식 있게",
    "간결하게",
  ];

  // AI 편집 기능 실행
  const handleAction = async (action) => {
    setSelectedAction(action);
    setIsApplied(false);

    // 편집 기능별 프롬프트
    const prompts = {
      "문장 다듬기":
        "문장의 의미는 유지하면서 자연스럽고 읽기 좋은 문장으로 다듬어 주세요.",

      "더 정중하게":
        "문장의 의미는 유지하면서 더 정중하고 예의 바른 표현으로 바꿔 주세요.",

      "격식 있게":
        "문장의 의미는 유지하면서 비즈니스 문서에 어울리는 격식 있는 표현으로 바꿔 주세요.",

      "간결하게":
        "문장의 핵심 의미는 유지하면서 불필요한 표현을 제거하고 간결하게 바꿔 주세요.",
    };

    // AI에게 전달할 프롬프트 생성
    const prompt = `
당신은 전문적인 AI 문서 편집기입니다.

사용자가 입력한 문장의 의미와 핵심 정보는 유지해야 합니다.

편집 요청:
${prompts[action]}

원문:
${content}

수정된 문장만 출력하세요.
설명이나 따옴표는 붙이지 마세요.
`;

    try {
      // 이전 AI 결과 초기화
      setResult("");

      // AI 요청 및 결과 저장
      const aiResult = await generate(prompt);

      setResult(aiResult);
    } catch (err) {
      console.error("AI 요청 실패:", err);
    }
  };

  // AI 결과를 원문에 적용
  const handleApply = () => {
    setContent(result);
    setIsApplied(true);
  };
  
  // AI 결과를 클립보드에 복사
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
  };

  return (
    <div className="editor-page">

      {/* 페이지 제목 및 설명 */}
      <section className="editor-page-header">
        <div>
          {/* 현재 페이지 위치 */}
          <div className="editor-eyebrow">
            WORKSPACE &gt; AI 문서 편집기
          </div>

          <h1>AI 문서 편집기</h1>

          <p>
            비즈니스 문장을 더 정갈하고 자연스럽게 다듬어 보세요.
          </p>
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
            <span className="character-count">
              {content.length}자
            </span>
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

           {/* AI 편집 기능 버튼 */}
          <div className="editor-actions">
            {actions.map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                selected={selectedAction === action}
                onClick={() => handleAction(action)}
                disabled={loading || !content.trim()}
                 >
                {action === "문장 다듬기" && (
                  <IconWand size={14} />
                )}

                {action}
              </Button>
            ))}
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
            }`}
           >
           {loading
            ? "문장을 수정하고 있습니다..."
            : result
            ? result
            : "편집 결과가 여기에 표시됩니다."}
          </div>

          <div className="editor-result-actions">
            <Button
              variant="gradient"
              size="md"
              onClick={handleApply}
              disabled={loading || !result}
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
    </div>
  );
}

export default DocumentEditorPage;