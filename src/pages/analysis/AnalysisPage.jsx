import { useEffect, useMemo, useRef, useState } from "react";

import { useAI } from "../../hooks/useAI";
import { createAnalysisDocumentPrompt } from "../../utils/analysisPrompts";
import { parseAIJson } from "../../utils/aiResponseUtils";
import ProgressModal from "../../components/common/ProgressModal";
import { IconUpload } from "../../components/common/Icons";

import "./AnalysisPage.css";

const DEFAULT_AI_PROVIDER = "openai";
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".txt", ".md"];
const MAX_PROGRESS = 92;
const COMPLETE_PROGRESS = 100;
const PROGRESS_INTERVAL = 280;
const PROGRESS_MESSAGES = [
  { at: 0, text: "문서를 읽고 있습니다." },
  { at: 30, text: "문서 종류를 분류하고 있습니다." },
  { at: 60, text: "핵심 내용을 요약하고 있습니다." },
  { at: 85, text: "담당자와 업무를 추출하고 있습니다." },
];

const hasAcceptedExtension = (fileName) =>
  ACCEPTED_EXTENSIONS.some((extension) =>
    fileName.toLowerCase().endsWith(extension)
  );

const normalizeResult = (data) => {
  const tasks =
    Array.isArray(data?.tasks) && data.tasks.length > 0
      ? data.tasks.map((task) => ({
          assignee: task?.assignee || "확인 필요",
          task: task?.task || "확인 필요",
          deadline: task?.deadline || "확인 필요",
        }))
      : [];

  return {
    classification: data?.classification || "기타",
    summary: data?.summary || "핵심 내용을 찾지 못했습니다.",
    tasks,
  };
};

export default function AnalysisPage() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const progressTimerRef = useRef(null);

  const { generate, loading, error } = useAI(DEFAULT_AI_PROVIDER);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const progressMessage = useMemo(() => {
    let currentMessage = PROGRESS_MESSAGES[0].text;

    PROGRESS_MESSAGES.forEach((message) => {
      if (progress >= message.at) {
        currentMessage = message.text;
      }
    });

    return currentMessage;
  }, [progress]);

  const isAnalyzing = loading || progress > 0;

  const readFile = (file) => {
    if (!hasAcceptedExtension(file.name)) {
      setFileError(
        "지금은 텍스트(.txt, .md) 파일만 지원합니다. 다른 형식이라면 내용을 복사해서 붙여넣어 주세요."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("파일 크기는 최대 20MB까지 지원합니다.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFileError("");
      setFileName(file.name);
      setText(String(reader.result || ""));
    };

    reader.onerror = () => {
      setFileError("파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsText(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      readFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      readFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleAnalyze = async () => {
    const documentText = text.trim();

    if (!documentText) {
      return;
    }

    setResult(null);
    setProgress(6);

    progressTimerRef.current = window.setInterval(() => {
      setProgress((previousProgress) => {
        if (previousProgress >= MAX_PROGRESS) {
          return previousProgress;
        }

        const progressStep =
          previousProgress < 35 ? 7 : previousProgress < 70 ? 4 : 2;

        return Math.min(MAX_PROGRESS, previousProgress + progressStep);
      });
    }, PROGRESS_INTERVAL);

    try {
      const response = await generate(
        createAnalysisDocumentPrompt(documentText)
      );
      const parsedResponse = parseAIJson(response);

      window.clearInterval(progressTimerRef.current);
      setProgress(COMPLETE_PROGRESS);

      window.setTimeout(() => {
        setResult(normalizeResult(parsedResponse));
        setProgress(0);
      }, 400);
    } catch (analyzeError) {
      window.clearInterval(progressTimerRef.current);
      setProgress(0);

      console.error("문서 분석 오류:", analyzeError);
    }
  };

  return (
    <main className="analysis-page">
      <div className="analysis-heading">
        <div>
          <div className="analysis-breadcrumb">
            WORKSPACE <span>›</span> 문서 분석기
          </div>

          <h1>문서 분석기</h1>

          <p>문서 속 담당자·업무·마감일을 찾아 Task로 연결해요.</p>
        </div>

        <span className="analysis-ready-badge">
          <i />
          AI 준비 완료
        </span>
      </div>

      <section className="analysis-card">
        <div
          className={`analysis-upload ${isDragging ? "is-dragging" : ""}`}
          onClick={handleBrowseClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            hidden
            onChange={handleFileInputChange}
          />

          <span className="analysis-upload-icon">
            <IconUpload size={20} />
          </span>

          {fileName ? (
            <p>
              <strong>{fileName}</strong> 업로드됨
            </p>
          ) : (
            <p>파일을 드래그하거나 클릭해서 업로드하세요</p>
          )}

          <span className="analysis-upload-caption">
            회의록, 이메일, 공문, 보고서 · 최대 20MB (.txt, .md)
          </span>
        </div>

        {fileError && <div className="analysis-inline-error">{fileError}</div>}

        <div className="analysis-paste-label">또는 문서 내용을 붙여넣기</div>

        <textarea
          className="analysis-textarea"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFileName("");
          }}
          placeholder="마케팅팀은 신제품 홍보자료를 9월 15일까지 작성하고, 개발팀은 홈페이지 배너를 9월 12일까지 제작한다."
        />

        <button
          className="analysis-analyze-button"
          type="button"
          disabled={!text.trim() || loading}
          onClick={handleAnalyze}
        >
          <span>✦</span>
          {loading ? "분석하고 있어요..." : "텍스트로 분석하기"}
        </button>

        {error && (
          <div className="analysis-inline-error">
            문서 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </div>
        )}
      </section>

      <section className="analysis-result-grid">
        <article className="analysis-result-card">
          <div className="analysis-result-header">
            <h2>문서 분류</h2>
            <span className="analysis-badge">분류</span>
          </div>
          <p>
            {result ? result.classification : "업로드 후 분류가 표시됩니다."}
          </p>
        </article>

        <article className="analysis-result-card">
          <div className="analysis-result-header">
            <h2>핵심 요약</h2>
            <span className="analysis-badge">요약</span>
          </div>
          <p>{result ? result.summary : "핵심 내용이 여기에 정리됩니다."}</p>
        </article>

        <article className="analysis-result-card">
          <div className="analysis-result-header">
            <h2>추출된 업무</h2>
            <span className="analysis-badge">업무</span>
          </div>

          {result && result.tasks.length > 0 ? (
            <ul className="analysis-task-list">
              {result.tasks.map((task, index) => (
                <li key={`${task.assignee}-${index}`}>
                  <strong>{task.assignee}</strong>
                  <span>{task.task}</span>
                  <span className="analysis-task-deadline">
                    {task.deadline}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>담당자와 할 일이 추출됩니다.</p>
          )}
        </article>
      </section>

      {isAnalyzing && (
        <ProgressModal
          progress={progress}
          message={progressMessage}
          title="AI가 문서를 분석하고 있습니다."
        />
      )}
    </main>
  );
}
