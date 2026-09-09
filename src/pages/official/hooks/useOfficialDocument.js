import { useMemo, useState } from "react";
import { useAI } from "../../../hooks/useAI";
import {
  COMMON_FIELDS,
  SAMPLE_PROMPT,
  applySample,
  emptyFields,
  findType,
  getSample,
} from "../Mock";
import {
  buildExtractPrompt,
  buildRewritePrompt,
  parseAIJson,
} from "../officialAi";

const initial = applySample("obituary");
const TONE_IDS = ["polite", "formal", "concise"];

export function useOfficialDocument() {
  const { generate, loading } = useAI("gemini");
  const [category, setCategory] = useState("official");
  const [documentType, setDocumentType] = useState("obituary");
  const [prompt, setPrompt] = useState(initial.prompt);
  const [fields, setFields] = useState(initial.fields);
  const [body, setBody] = useState(initial.body);
  const [tone, setTone] = useState("polite");
  const [companyStyle, setCompanyStyle] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [showStamp, setShowStamp] = useState(false);
  const [showExtracted, setShowExtracted] = useState(true);
  const [stampImage, setStampImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);

  const type = useMemo(() => findType(documentType), [documentType]);
  const visibleFields = showSignature
    ? [...type.fields, ...COMMON_FIELDS]
    : type.fields;

  const closeToast = () => setToast(null);

  const showError = (message) => {
    setToast({ kind: "error", message });
  };

  const showInfo = (message, kind = "default") => {
    setToast({ kind, message });
  };

  const updateField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (nextType) => {
    const next = applySample(nextType);
    setDocumentType(nextType);
    setPrompt(next.prompt);
    setFields(next.fields);
    setBody(getSample(nextType).body[tone] ?? next.body);
    setEditing(false);
  };

  const fallbackExtract = (nextType = documentType) => {
    const sample = getSample(nextType);
    setDocumentType(nextType);
    setFields({ ...emptyFields(), ...sample.fields });
    setBody(sample.body[tone] ?? sample.body.polite);
    setShowExtracted(true);
  };

  const fallbackRewrite = (nextTone) => {
    const sample = getSample(documentType);
    setBody(sample.body[nextTone] ?? sample.body.polite);
  };

  const handleGenerate = async () => {
    const userPrompt = prompt.trim() || SAMPLE_PROMPT;
    if (!prompt.trim()) setPrompt(SAMPLE_PROMPT);

    try {
      const raw = await generate(
        buildExtractPrompt({
          prompt: userPrompt,
          tone,
          companyStyle,
          showSignature,
        })
      );
      const parsed = parseAIJson(raw);
      const nextType = findType(parsed.documentType).id;
      setDocumentType(nextType);
      setFields({ ...emptyFields(), ...(parsed.fields ?? {}) });
      setBody(parsed.body || getSample(nextType).body[tone]);
      if (parsed.tone && TONE_IDS.includes(parsed.tone)) {
        setTone(parsed.tone);
      }
      setShowExtracted(true);
      setEditing(false);
    } catch (err) {
      fallbackExtract();
      showError(
        err?.message
          ? `AI 작성에 실패해 예시 문서로 채웠습니다. (${err.message})`
          : "AI 작성에 실패해 예시 문서로 채웠습니다."
      );
    }
  };

  const handleRewrite = async (nextTone) => {
    setTone(nextTone);
    const source = body.trim();

    if (!source) {
      fallbackRewrite(nextTone);
      return;
    }

    try {
      const raw = await generate(buildRewritePrompt({ body: source, tone: nextTone }));
      const parsed = parseAIJson(raw);
      setBody(parsed.body || source);
      setEditing(false);
    } catch (err) {
      fallbackRewrite(nextTone);
      showError(
        err?.message
          ? `문체 변경에 실패해 예시 문장으로 바꿨습니다. (${err.message})`
          : "문체 변경에 실패해 예시 문장으로 바꿨습니다."
      );
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      showInfo("본문을 복사했습니다.", "success");
    } catch {
      showError("복사에 실패했습니다.");
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        "official-document-draft",
        JSON.stringify({
          documentType,
          fields,
          body,
          tone,
          stampImage,
          showStamp,
        })
      );
      showInfo("현재 문서를 저장했습니다.", "success");
    } catch {
      showError("저장에 실패했습니다.");
    }
  };

  return {
    loading,
    toast,
    closeToast,
    category,
    setCategory,
    documentType,
    handleTypeChange,
    prompt,
    setPrompt,
    fields,
    updateField,
    visibleFields,
    body,
    setBody,
    tone,
    setTone,
    companyStyle,
    setCompanyStyle,
    showSignature,
    setShowSignature,
    showStamp,
    setShowStamp,
    showExtracted,
    setShowExtracted,
    stampImage,
    setStampImage,
    editing,
    setEditing,
    handleGenerate,
    handleRewrite,
    handleCopy,
    handleSave,
    showInfo,
  };
}
