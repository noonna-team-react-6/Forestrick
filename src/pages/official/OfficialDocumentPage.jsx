import { useEffect, useMemo, useRef, useState } from "react";

import { useAI } from "../../hooks/useAI";
import { PROGRESS_MESSAGES } from "../../data/mockTasks";
import { createOfficialDocumentPrompt } from "../../utils/officialPrompts";
import { parseAIJson } from "../../utils/aiResponseUtils";
import {
  downloadDocumentAsText,
  printDocumentAsPdf,
  saveDocument,
} from "../../utils/documentUtils";
import OfficialInput from "../../components/official/OfficialInput";
import OfficialResultPanel from "../../components/official/OfficialResultPanel";
import ProgressModal from "../../components/assistant/ProgressModal";

import "../assistant/AssistantPage.css";
import "./OfficialDocumentPage.css";

const DEFAULT_AI_PROVIDER = "openai";
const MAX_PROGRESS = 92;
const COMPLETE_PROGRESS = 100;
const PROGRESS_INTERVAL = 280;
const RESULT_OPEN_DELAY = 420;
const TOAST_DURATION = 1800;

export default function OfficialDocumentPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [progress, setProgress] = useState(0);
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [resultKey, setResultKey] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const progressTimerRef = useRef(null);

  const { generate, loading, error } = useAI(DEFAULT_AI_PROVIDER);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const toastTimer = window.setTimeout(() => {
      setToastMessage("");
    }, TOAST_DURATION);

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [toastMessage]);

  const progressMessage = useMemo(() => {
    let currentMessage = PROGRESS_MESSAGES[0].text;

    PROGRESS_MESSAGES.forEach((message) => {
      if (progress >= message.at) {
        currentMessage = message.text;
      }
    });

    return currentMessage;
  }, [progress]);

  const isGenerating = loading || progress > 0;

  const handleFieldChange = (field, value) => {
    if (field === "to") {
      setTo(value);
    } else if (field === "subject") {
      setSubject(value);
    } else if (field === "content") {
      setContent(value);
    }
  };

  const handleGenerate = async () => {
    if (!to.trim() || !subject.trim() || !content.trim()) {
      return;
    }

    setProgress(6);

    progressTimerRef.current = window.setInterval(() => {
      setProgress((previousProgress) => {
        if (previousProgress >= MAX_PROGRESS) {
          return previousProgress;
        }

        const progressStep =
          previousProgress < 35
            ? 7
            : previousProgress < 70
              ? 4
              : 2;

        return Math.min(MAX_PROGRESS, previousProgress + progressStep);
      });
    }, PROGRESS_INTERVAL);

    try {
      const response = await generate(
        createOfficialDocumentPrompt({ to, subject, content })
      );

      const parsedResponse = parseAIJson(response);

      window.clearInterval(progressTimerRef.current);
      setProgress(COMPLETE_PROGRESS);

      window.setTimeout(() => {
        setGeneratedDocument(parsedResponse);
        setResultKey((previousKey) => previousKey + 1);
        setProgress(0);
      }, RESULT_OPEN_DELAY);
    } catch (generateError) {
      window.clearInterval(progressTimerRef.current);
      setProgress(0);

      console.error("공문 생성 오류:", generateError);
    }
  };

  const handleCopy = async (documentText) => {
    await navigator.clipboard.writeText(documentText);
    setToastMessage("문서를 복사했습니다.");
  };

  const handlePrintPdf = (documentText) => {
    printDocumentAsPdf(generatedDocument?.title, documentText);
  };

  const handleDownloadText = (documentText) => {
    downloadDocumentAsText(generatedDocument?.title, documentText);
  };

  const handleSave = (documentText) => {
    saveDocument({
      title: generatedDocument?.title || subject || "공문",
      type: "official",
      content: documentText,
    });

    setToastMessage("문서 보관함에 저장했습니다.");
  };

  return (
    <main className="assistant-page official-page">
      <div className="assistant-heading">
        <div>
          <div className="assistant-breadcrumb">
            WORKSPACE <span>›</span> 공식 문서 생성기
          </div>

          <h1>공식 문서 생성기</h1>

          <p>수신 대상과 핵심 내용만 알려주면 공문 형식으로 작성해 드려요.</p>
        </div>

        <span className="ai-ready-badge">
          <i />
          AI 준비 완료
        </span>
      </div>

      <section className="assistant-workspace official-workspace">
        <OfficialInput
          to={to}
          subject={subject}
          content={content}
          isLoading={loading}
          hasError={Boolean(error)}
          onFieldChange={handleFieldChange}
          onGenerate={handleGenerate}
        />

        <OfficialResultPanel
          key={resultKey}
          document={generatedDocument}
          onCopy={handleCopy}
          onPrintPdf={handlePrintPdf}
          onDownloadText={handleDownloadText}
          onSave={handleSave}
        />
      </section>

      {isGenerating && (
        <ProgressModal progress={progress} message={progressMessage} />
      )}

      {toastMessage && (
        <div className="toast-message">{toastMessage}</div>
      )}
    </main>
  );
}
