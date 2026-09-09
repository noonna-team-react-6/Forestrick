import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzeTask, generateDocument } from "../../api/aiApi";
import "./AssistantPage.css";

const EXAMPLES = [
  "이번 주 금요일 오후 3시에 개발팀 회의가 있어. 참석자에게 안내 메일을 보내고 회의실도 예약해줘.",
  "다음 주 월요일 오전 10시에 3층 회의실에서 신제품 출시 관련 팀 미팅을 진행합니다.",
  "다음 주 수요일 오후 2시에 개발팀 회의 일정을 변경하고 참석자들에게 알려줘.",
];

const PROGRESS_MESSAGES = [
  { at: 0, text: "입력하신 업무를 문서로 만들 준비를 하고 있습니다." },
  { at: 24, text: "업무의 핵심 정보와 대상자를 확인하고 있습니다." },
  { at: 48, text: "문서 구조와 적절한 문체를 구성하고 있습니다." },
  { at: 72, text: "내용을 자연스럽게 다듬고 있습니다." },
  { at: 90, text: "최종 문서를 검토하고 있습니다." },
];

function normalizeAnalysis(data) {
  return {
    topic: data?.title || data?.taskType || "업무 요청",
    dateTime: [data?.date, data?.time].filter(Boolean).join(" ") || "일정 확인 필요",
    location: data?.location || "장소 확인 필요",
    target: data?.target || "관련 팀",
    summary: data?.summary || "업무 요청을 분석했습니다.",
    actions:
      Array.isArray(data?.actions) && data.actions.length
        ? data.actions.map((item, index) => ({
            id: `action-${index}`,
            label: typeof item === "string" ? item : item.label || item.title || "작업",
          }))
        : [
            { id: "notice", label: "참석자 안내 문서 작성" },
            { id: "schedule", label: "일정 확인 및 정리" },
          ],
  };
}

function documentToPlainText(doc) {
  const lines = [];
  if (doc?.title) lines.push(doc.title, "");
  if (doc?.to) lines.push(`받는 사람: ${doc.to}`);
  if (doc?.subject) lines.push(`제목: ${doc.subject}`, "");
  if (doc?.greeting) lines.push(doc.greeting, "");
  (doc?.paragraphs || []).forEach((p) => lines.push(p, ""));
  if (doc?.closing) lines.push(doc.closing, "");
  if (doc?.signature) lines.push(doc.signature);
  return lines.join("\n");
}

export default function AssistantPage() {
  const [input, setInput] = useState(EXAMPLES[1]);
  const [analysis, setAnalysis] = useState(null);
  const [selectedActions, setSelectedActions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [toast, setToast] = useState("");
  const progressTimer = useRef(null);

  const analyzeMutation = useMutation({
    mutationFn: analyzeTask,
    onSuccess: (data) => {
      const normalized = normalizeAnalysis(data);
      setAnalysis(normalized);
      setSelectedActions(normalized.actions.map((item) => item.id));
    },
  });

  const generateMutation = useMutation({
    mutationFn: generateDocument,
    onMutate: () => {
      setProgress(6);
      progressTimer.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 92) return prev;
          return Math.min(92, prev + (prev < 35 ? 7 : prev < 70 ? 4 : 2));
        });
      }, 280);
    },
    onSuccess: (data) => {
      window.clearInterval(progressTimer.current);
      setProgress(100);
      window.setTimeout(() => {
        setGeneratedDoc(data);
        setEditedText(documentToPlainText(data));
        setIsResultOpen(true);
        setProgress(0);
      }, 420);
    },
    onError: () => {
      window.clearInterval(progressTimer.current);
      setProgress(0);
    },
  });

  useEffect(() => () => {
    if (progressTimer.current) window.clearInterval(progressTimer.current);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const progressMessage = useMemo(() => {
    let current = PROGRESS_MESSAGES[0].text;
    PROGRESS_MESSAGES.forEach((item) => {
      if (progress >= item.at) current = item.text;
    });
    return current;
  }, [progress]);

  const toggleAction = (id) => {
    setSelectedActions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setAnalysis(null);
    setGeneratedDoc(null);
    analyzeMutation.mutate(input.trim());
  };

  const handleGenerate = () => {
    const selected = analysis.actions
      .filter((item) => selectedActions.includes(item.id))
      .map((item) => item.label);

    generateMutation.mutate({
      originalRequest: input,
      analysis,
      selectedActions: selected,
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      isEditing ? editedText : documentToPlainText(generatedDoc)
    );
    setToast("문서를 복사했습니다.");
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("forestrick-documents") || "[]");
    const item = {
      id: crypto.randomUUID(),
      title: generatedDoc?.title || analysis?.topic || "AI 생성 문서",
      type: "email",
      content: isEditing ? editedText : documentToPlainText(generatedDoc),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("forestrick-documents", JSON.stringify([item, ...saved]));
    setToast("문서 보관함에 저장했습니다.");
  };

  const handleDownloadTxt = () => {
    const text = isEditing ? editedText : documentToPlainText(generatedDoc);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${generatedDoc?.title || "AI_생성_문서"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    const text = isEditing ? editedText : documentToPlainText(generatedDoc);
    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) return;
    const safeText = text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    printWindow.document.write(`<!doctype html><html lang="ko"><head><meta charset="UTF-8"><title>${generatedDoc?.title || "AI 생성 문서"}</title><style>body{font-family:Pretendard,Arial,sans-serif;margin:48px;color:#111827}pre{white-space:pre-wrap;font:inherit;line-height:1.9}</style></head><body><pre>${safeText}</pre></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 250);
  };

  const isGenerating = generateMutation.isPending || progress > 0;

  return (
    <main className="assistant-page">
      <div className="assistant-heading">
        <div>
          <div className="assistant-breadcrumb">WORKSPACE <span>›</span> AI 업무 비서</div>
          <h1>AI 업무 비서</h1>
          <p>업무를 말하면 필요한 작업을 판단하고, 문서 작성과 후속 업무까지 연결해요.</p>
        </div>
        <span className="ai-ready-badge"><i /> AI 준비 완료</span>
      </div>

      <section className="assistant-workspace">
        <article className="assistant-card input-card">
          <div className="card-title-row">
            <span className="sparkle-icon">✦</span>
            <div>
              <h2>어떤 업무를 도와드릴까요?</h2>
              <p>양식 없이, 사람에게 말하듯 입력해 주세요.</p>
            </div>
          </div>

          <textarea
            className="assistant-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="example-row">
            <span className="example-label">예시</span>
            <div className="example-chips">
              {EXAMPLES.map((example) => (
                <button key={example} type="button" onClick={() => setInput(example)}>
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            className="primary-action analyze-button"
            type="button"
            disabled={!input.trim() || analyzeMutation.isPending}
            onClick={handleAnalyze}
          >
            <span>✦</span>
            {analyzeMutation.isPending ? "업무를 파악하고 있어요..." : "업무 분석하기"}
          </button>

          {analyzeMutation.isError && (
            <div className="inline-error">업무 분석 중 오류가 발생했습니다.</div>
          )}
        </article>

        <article className={`assistant-card analysis-card ${analysis ? "is-ready" : ""}`}>
          {!analysis ? (
            <div className="empty-analysis">
              <div className="empty-icon">▣</div>
              <strong>분석 결과가 여기에 보여요</strong>
              <p>업무 내용을 입력하고 분석하기를 눌러보세요.</p>
            </div>
          ) : (
            <>
              <div className="analysis-header">
                <div>
                  <span className="eyebrow">AI 업무 분석</span>
                  <h2>무슨 일인지 파악했어요</h2>
                  <p>{analysis.summary}</p>
                </div>
                <span className="analysis-complete">분석 완료</span>
              </div>

              <div className="analysis-grid">
                <div><span>주제</span><strong>{analysis.topic}</strong></div>
                <div><span>일시</span><strong>{analysis.dateTime}</strong></div>
                <div><span>장소</span><strong>{analysis.location}</strong></div>
                <div><span>대상</span><strong>{analysis.target}</strong></div>
              </div>

              <div className="task-section">
                <div className="task-section-title">
                  <span>필요한 작업</span>
                  <small>{selectedActions.length}개 선택</small>
                </div>
                <div className="task-list">
                  {analysis.actions.map((item) => {
                    const checked = selectedActions.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`task-item ${checked ? "selected" : ""}`}
                        onClick={() => toggleAction(item.id)}
                      >
                        <span className="task-checkbox">{checked ? "✓" : ""}</span>
                        <span>
                          <strong>{item.label}</strong>
                          <small>{analysis.dateTime} · {analysis.location}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="analysis-recommendation">
                <strong>{analysis.dateTime} 기준으로 선택한 업무를 준비할게요.</strong>
                <p>실행 전 선택 항목을 다시 확인해 주세요.</p>
              </div>

              <button
                className="primary-action execute-button"
                type="button"
                disabled={selectedActions.length === 0 || isGenerating}
                onClick={handleGenerate}
              >
                <span>✦</span> 선택한 작업 실행하기
              </button>
            </>
          )}
        </article>
      </section>

      {isGenerating && (
        <div className="modal-backdrop">
          <div className="progress-modal">
            <div className="progress-symbol">✦</div>
            <span className="progress-kicker">FORESTRICK AI</span>
            <h2>AI가 문서를 작성하고 있습니다.</h2>
            <p className="progress-message">{progressMessage}</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <strong className="progress-percent">{progress}%</strong>
            <p className="progress-caption">잠시만 기다려주세요.</p>
          </div>
        </div>
      )}

      {isResultOpen && generatedDoc && (
        <div className="modal-backdrop result-backdrop">
          <div className="result-modal">
            <div className="result-modal-header">
              <div>
                <span className="result-kicker">AI 생성 완료</span>
                <h2>생성 결과</h2>
              </div>
              <button className="icon-close" type="button" onClick={() => setIsResultOpen(false)}>×</button>
            </div>

            <div className="result-tabs">
              <button className="active" type="button">이메일</button>
              <button type="button">일정변경</button>
              <button type="button">예약</button>
            </div>

            <div className="document-paper">
              {isEditing ? (
                <textarea
                  className="document-editor"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              ) : (
                <>
                  <div className="document-meta-top"><span>AI 생성 문서</span><span>사내 문서</span></div>
                  <h3>{generatedDoc.title}</h3>
                  <div className="mail-meta">
                    <div><span>받는 사람</span><strong>{generatedDoc.to}</strong></div>
                    <div><span>제목</span><strong>{generatedDoc.subject}</strong></div>
                  </div>
                  <div className="document-body">
                    {generatedDoc.greeting && <p>{generatedDoc.greeting}</p>}
                    {(generatedDoc.paragraphs || []).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    {generatedDoc.closing && <p>{generatedDoc.closing}</p>}
                    {generatedDoc.signature && <strong className="signature">{generatedDoc.signature}</strong>}
                  </div>
                </>
              )}
            </div>

            <div className="result-actions">
              <div className="action-group">
                <button type="button" onClick={() => setIsEditing((prev) => !prev)}>
                  ✎ {isEditing ? "수정 완료" : "수정"}
                </button>
                <button type="button" onClick={handleCopy}>▣ 복사</button>
                <div className="download-menu">
                  <button type="button">⇩ PDF/파일</button>
                  <div className="download-options">
                    <button type="button" onClick={handlePrintPdf}>PDF로 인쇄</button>
                    <button type="button" onClick={handleDownloadTxt}>TXT 파일 저장</button>
                  </div>
                </div>
              </div>
              <button className="save-button" type="button" onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-message">{toast}</div>}
    </main>
  );
}
