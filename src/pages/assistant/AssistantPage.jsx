import { useEffect, useMemo, useRef, useState } from "react";

import { useAI } from "../../hooks/useAI";
import { PROGRESS_MESSAGES } from "../../data/mockTasks";
import {
  createAnalysisPrompt,
  createDocumentPrompt,
} from "../../utils/assistantPrompts";
import { parseAIJson } from "../../utils/aiResponseUtils";
import {
  downloadDocumentAsText,
  printDocumentAsPdf,
  saveDocument,
} from "../../utils/documentUtils";
import AssistantInput from "../../components/assistant/AssistantInput";
import AnalysisResult from "../../components/assistant/AnalysisResult";
import GeneratedDocument from "../../components/assistant/GeneratedDocument";
import ProgressModal from "../../components/assistant/ProgressModal";

import "./AssistantPage.css";

const DEFAULT_AI_PROVIDER = "openai";
const MAX_PROGRESS = 92;
const COMPLETE_PROGRESS = 100;
const PROGRESS_INTERVAL = 280;
const RESULT_OPEN_DELAY = 420;
const TOAST_DURATION = 1800;

const normalizeAnalysis = (data) => {
  const actions =
    Array.isArray(data?.actions) && data.actions.length > 0
      ? data.actions.map((item, index) => ({
          id: `action-${index}`,
          label:
            typeof item === "string"
              ? item
              : item.label || item.title || "작업",
        }))
      : [];

  return {
    topic: data?.title || data?.taskType || "업무 요청",
    dateTime:
      [data?.date, data?.time].filter(Boolean).join(" ") ||
      "일정 확인 필요",
    location: data?.location || "장소 확인 필요",
    target: data?.target || "관련 팀",
    summary: data?.summary || "업무 요청을 분석했습니다.",
    actions,
  };
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [selectedActions, setSelectedActions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const progressTimerRef = useRef(null);

  const {
    generate: generateAnalysis,
    loading: isAnalyzing,
    error: analysisError,
  } = useAI(DEFAULT_AI_PROVIDER);

  const {
    generate: generateDocument,
    loading: isGeneratingDocument,
    error: generationError,
  } = useAI(DEFAULT_AI_PROVIDER);

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

  const isGenerating =
    isGeneratingDocument || progress > 0;
  const hasSelectedActions =
    selectedActions.length > 0;

  const handleInputChange = (value) => {
    setInput(value);
  };

  const handleAnalyze = async () => {
    const requestText = input.trim();

    if (!requestText) {
      return;
    }

    setAnalysis(null);
    setGeneratedDocument(null);

    try {
      const response = await generateAnalysis(
        createAnalysisPrompt(requestText)
      );
      const parsedResponse = parseAIJson(response);
      const normalizedAnalysis =
        normalizeAnalysis(parsedResponse);

      setAnalysis(normalizedAnalysis);
      setSelectedActions(
        normalizedAnalysis.actions.map(
          (action) => action.id
        )
      );
    } catch (error) {
      console.error(
        "AI 업무 분석 오류:",
        error
      );
    }
  };

  const handleActionToggle = (actionId) => {
    setSelectedActions((previousActions) =>
      previousActions.includes(actionId)
        ? previousActions.filter(
            (selectedActionId) =>
              selectedActionId !== actionId
          )
        : [...previousActions, actionId]
    );
  };

  const handleGenerate = async () => {
    if (!analysis || !hasSelectedActions) {
      return;
    }

    const selectedActionLabels = analysis.actions
      .filter((action) =>
        selectedActions.includes(action.id)
      )
      .map((action) => action.label);

    setProgress(6);

    progressTimerRef.current =
      window.setInterval(() => {
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

          return Math.min(
            MAX_PROGRESS,
            previousProgress + progressStep
          );
        });
      }, PROGRESS_INTERVAL);

    try {
      const response = await generateDocument(
        createDocumentPrompt({
          originalRequest: input,
          analysis,
          selectedActions:
            selectedActionLabels,
        })
      );

      const parsedResponse =
        parseAIJson(response);

      window.clearInterval(
        progressTimerRef.current
      );

      setProgress(COMPLETE_PROGRESS);

      window.setTimeout(() => {
        setGeneratedDocument(parsedResponse);
        setIsResultOpen(true);
        setProgress(0);
      }, RESULT_OPEN_DELAY);
    } catch (error) {
      window.clearInterval(
        progressTimerRef.current
      );

      setProgress(0);

      console.error(
        "AI 문서 생성 오류:",
        error
      );
    }
  };

  const handleCopy = async (documentText) => {
    await navigator.clipboard.writeText(
      documentText
    );

    setToastMessage(
      "문서를 복사했습니다."
    );
  };

  const handlePrintPdf = (documentText) => {
    printDocumentAsPdf(
      generatedDocument?.title,
      documentText
    );
  };

  const handleDownloadText = (documentText) => {
    downloadDocumentAsText(
      generatedDocument?.title,
      documentText
    );
  };

  const handleSave = (documentText) => {
    saveDocument({
      title:
        generatedDocument?.title ||
        analysis?.topic ||
        "AI 생성 문서",
      type: "email",
      content: documentText,
    });

    setToastMessage(
      "문서 보관함에 저장했습니다."
    );
  };

  const handleResultClose = () => {
    setIsResultOpen(false);
  };

  return (
    <main className="assistant-page">
      <div className="assistant-heading">
        <div>
          <div className="assistant-breadcrumb">
            WORKSPACE <span>›</span> AI 업무 비서
          </div>

          <h1>AI 업무 비서</h1>

          <p>
            업무를 말하면 필요한 작업을 판단하고, 문서 작성과 후속
            업무까지 연결해요.
          </p>
        </div>

        <span className="ai-ready-badge">
          <i />
          AI 준비 완료
        </span>
      </div>

      <section className="assistant-workspace">
        <AssistantInput
          input={input}
          isLoading={isAnalyzing}
          hasError={Boolean(analysisError)}
          onInputChange={handleInputChange}
          onAnalyze={handleAnalyze}
        />

        <AnalysisResult
          analysis={analysis}
          selectedActions={selectedActions}
          isGenerating={isGenerating}
          hasError={Boolean(generationError)}
          onActionToggle={handleActionToggle}
          onGenerate={handleGenerate}
        />
      </section>

      {isGenerating && (
        <ProgressModal
          progress={progress}
          message={progressMessage}
        />
      )}

      {isResultOpen && generatedDocument && (
        <GeneratedDocument
          document={generatedDocument}
          onClose={handleResultClose}
          onCopy={handleCopy}
          onPrintPdf={handlePrintPdf}
          onDownloadText={handleDownloadText}
          onSave={handleSave}
        />
      )}

      {toastMessage && (
        <div className="toast-message">
          {toastMessage}
        </div>
      )}
    </main>
  );
}
