import { useRef, useState } from "react";
import mammoth from "mammoth";

import { useAI } from "../../hooks/useAI";
import { useProgressSimulation } from "../../hooks/useProgressSimulation";
import useDocuments from "../../hooks/useDocuments";
import {
  createAnalysisDocumentPrompt,
  createAnalysisDocumentAttachmentPrompt,
} from "../../utils/analysisPrompts";
import { parseAIJson } from "../../utils/aiResponseUtils";
import ProgressModal from "../../components/common/ProgressModal";
import Toast, { Error as ErrorToast } from "../../components/common/Toast";
import Button from "../../components/common/Button";
import { IconUpload, IconDownload } from "../../components/common/Icons";

import "./AnalysisPage.css";

// PDF는 Claude/Gemini만 문서를 직접 읽을 수 있어 첨부 시에는 provider를 고정
const FILE_ATTACHMENT_PROVIDER = "claude";
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const TEXT_EXTENSIONS = [".txt", ".md"];
const PDF_MIME_TYPE = "application/pdf";
const ACCEPTED_EXTENSIONS = [...TEXT_EXTENSIONS, ".pdf", ".docx"];
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

const isTextFile = (fileName) =>
  TEXT_EXTENSIONS.some((extension) => fileName.toLowerCase().endsWith(extension));

const isPdfFile = (fileName) => fileName.toLowerCase().endsWith(".pdf");

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

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

const formatAnalysisAsText = (result) => {
  const lines = [
    `문서 분류: ${result.classification}`,
    "",
    "핵심 요약",
    result.summary,
    "",
    "추출된 업무",
  ];

  if (result.tasks.length > 0) {
    result.tasks.forEach((task) => {
      lines.push(`- ${task.assignee} · ${task.task} · ${task.deadline}`);
    });
  } else {
    lines.push("이 문서에서는 추출할 업무가 없어요.");
  }

  return lines.join("\n");
};

export default function AnalysisPage() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);
  const savedDocumentIdRef = useRef(null);
  const savedSnapshotRef = useRef(null);

  const provider = attachedFile ? FILE_ATTACHMENT_PROVIDER : undefined;
  const { generate, loading, error } = useAI(provider);
  const { addDocument, updateDocument } = useDocuments();

  const closeToast = () => setToast(null);

  const {
    progress,
    message: progressMessage,
    start: startProgress,
    complete: completeProgress,
    reset: resetProgress,
  } = useProgressSimulation(PROGRESS_MESSAGES);

  const isAnalyzing = loading || progress > 0;

  const readFile = async (file) => {
    if (!hasAcceptedExtension(file.name)) {
      setFileError(
        "지금은 .txt, .md, .pdf, .docx 파일만 지원합니다. 다른 형식이라면 내용을 복사해서 붙여넣어 주세요."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("파일 크기는 최대 20MB까지 지원합니다.");
      return;
    }

    setFileError("");
    setIsReadingFile(true);

    try {
      if (isTextFile(file.name)) {
        const content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(reader.error);
          reader.readAsText(file);
        });

        setAttachedFile(null);
        setText(content);
      } else if (isPdfFile(file.name)) {
        const dataUrl = await readFileAsDataUrl(file);
        const base64 = dataUrl.split(",")[1] || "";

        setText("");
        setAttachedFile({ base64, mimeType: PDF_MIME_TYPE, name: file.name });
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const { value } = await mammoth.extractRawText({ arrayBuffer });

        setAttachedFile(null);
        setText(value.trim());
      }

      setFileName(file.name);
    } catch (readError) {
      console.error("파일 읽기 오류:", readError);
      setFileError(
        isPdfFile(file.name)
          ? "PDF 파일을 읽는 중 오류가 발생했습니다."
          : "올바른 문서 파일인지 확인해 주세요."
      );
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      void readFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void readFile(file);
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

    if (!documentText && !attachedFile) {
      return;
    }

    setResult(null);
    savedDocumentIdRef.current = null;
    savedSnapshotRef.current = null;
    startProgress();

    try {
      const response = attachedFile
        ? await generate(
            createAnalysisDocumentAttachmentPrompt(attachedFile.name),
            {
              file: {
                base64: attachedFile.base64,
                mimeType: attachedFile.mimeType,
              },
            }
          )
        : await generate(createAnalysisDocumentPrompt(documentText));
      const parsedResponse = parseAIJson(response);

      completeProgress(() => {
        setResult(normalizeResult(parsedResponse));
      }, 400);
    } catch (analyzeError) {
      resetProgress();

      console.error("문서 분석 오류:", analyzeError);
    }
  };

  const handleSave = () => {
    if (!result) {
      return;
    }

    const payload = {
      title: fileName ? fileName.replace(/\.[^.]+$/, "") : "문서 분석 결과",
      category: result.classification,
      source: "analysis",
      content: formatAnalysisAsText(result),
      classification: result.classification,
      summary: result.summary,
      tasks: result.tasks,
    };
    const snapshot = JSON.stringify(payload);

    try {
      if (savedDocumentIdRef.current) {
        if (savedSnapshotRef.current === snapshot) {
          setToast({ kind: "default", message: "이미 저장된 문서입니다." });
          return;
        }

        updateDocument(savedDocumentIdRef.current, payload);
        savedSnapshotRef.current = snapshot;
        setToast({ kind: "success", message: "분석 결과를 다시 저장했습니다." });
        return;
      }

      const saved = addDocument(payload);
      savedDocumentIdRef.current = saved.id;
      savedSnapshotRef.current = snapshot;
      setToast({ kind: "success", message: "문서 보관함에 저장했습니다." });
    } catch {
      setToast({ kind: "error", message: "저장에 실패했습니다." });
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
              <strong>{fileName}</strong>{" "}
              {isReadingFile ? "읽는 중..." : "업로드됨"}
            </p>
          ) : (
            <p>파일을 드래그하거나 클릭해서 업로드하세요</p>
          )}

          <span className="analysis-upload-caption">
            회의록, 이메일, 공문, 보고서 · 최대 20MB (.txt, .md, .pdf, .docx)
          </span>
        </div>

        {fileError && <div className="analysis-inline-error">{fileError}</div>}

        {attachedFile && (
          <div className="analysis-attached-note">
            PDF는 미리보기 없이 AI가 파일을 직접 읽어서 분석합니다.
          </div>
        )}

        <div className="analysis-paste-label">또는 문서 내용을 붙여넣기</div>

        <textarea
          className="analysis-textarea"
          value={text}
          disabled={Boolean(attachedFile)}
          onChange={(event) => {
            setText(event.target.value);
            setFileName("");
            setAttachedFile(null);
          }}
          placeholder="마케팅팀은 신제품 홍보자료를 9월 15일까지 작성하고, 개발팀은 홈페이지 배너를 9월 12일까지 제작한다."
        />

        <button
          className="analysis-analyze-button"
          type="button"
          disabled={(!text.trim() && !attachedFile) || loading}
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
          ) : result ? (
            <p>이 문서에서는 추출할 업무가 없어요.</p>
          ) : (
            <p>담당자와 할 일이 추출됩니다.</p>
          )}
        </article>
      </section>

      {result && (
        <div className="analysis-save-row">
          <Button variant="primary" size="sm" onClick={handleSave}>
            <IconDownload size={16} />
            문서 보관함에 저장
          </Button>
        </div>
      )}

      {isAnalyzing && (
        <ProgressModal
          progress={progress}
          message={progressMessage}
          title="AI가 문서를 분석하고 있습니다."
        />
      )}

      {toast?.kind === "error" ? (
        <ErrorToast open message={toast.message} onClose={closeToast} />
      ) : (
        <Toast
          open={Boolean(toast)}
          type={toast?.kind === "success" ? "success" : "default"}
          message={toast?.message}
          onClose={closeToast}
        />
      )}
    </main>
  );
}
