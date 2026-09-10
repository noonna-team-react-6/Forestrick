import { useMemo, useRef, useState } from "react";
import { applyFieldToBody } from "./applyFieldToBody";
import { buildPreviewBody } from "./buildPreviewBody";
import {
  DOCUMENT_TYPES,
  SAMPLE_PROMPT,
  emptyFields,
  findType,
  getSample,
} from "../../pages/official/Mock";
import {
  buildExtractPrompt,
  buildRegisterPrompt,
  buildRewritePrompt,
  inferTypeFromPrompt,
  parseAIJson,
} from "../../pages/official/officialAi";
import { useAI } from "../useAI";

const TONE_IDS = ["polite", "formal", "concise"];

function resolveType(id, prompt) {
  if (DOCUMENT_TYPES.some((item) => item.id === id)) return id;
  return inferTypeFromPrompt(prompt);
}

function hasFieldValues(fields) {
  return Object.values(fields).some((value) => String(value ?? "").trim());
}

export function useOfficialDocument() {
  const { generate, loading } = useAI("gemini");
  const [category, setCategory] = useState("official");
  const [documentType, setDocumentType] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [fields, setFields] = useState(() => emptyFields());
  const [body, setBody] = useState("");
  const [tone, setTone] = useState("polite");
  const [companyStyle, setCompanyStyle] = useState(true);
  const [companyName, setCompanyName] = useState("노나 주식회사");
  const [showDepartment, setShowDepartment] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [showStamp, setShowStamp] = useState(false);
  const [stampAtCenter, setStampAtCenter] = useState(false);
  const [stampAtName, setStampAtName] = useState(true);
  const [showExtracted, setShowExtracted] = useState(false);
  const [stampImage, setStampImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("문서를 작성하는 중");
  const syncedFieldsRef = useRef(emptyFields());

  const rememberFields = (nextFields) => {
    syncedFieldsRef.current = nextFields;
  };

  const type = useMemo(() => findType(documentType), [documentType]);
  const visibleFields = type.fields;

  const closeToast = () => setToast(null);

  const showError = (message) => {
    setToast({ kind: "error", message });
  };

  const showInfo = (message, kind = "default") => {
    setToast({ kind, message });
  };

  const updateField = (key, value) => {
    const previous = syncedFieldsRef.current[key];
    setFields((prev) => ({ ...prev, [key]: value }));
    setBody((current) => {
      const patched = applyFieldToBody(current, previous, value);
      if (patched.didSync) return patched.body;
      return buildPreviewBody(
        documentType,
        { ...syncedFieldsRef.current, [key]: value },
        tone,
      );
    });
    rememberFields({ ...syncedFieldsRef.current, [key]: value });
  };

  const handleTypeChange = (nextType) => {
    setDocumentType(nextType);
    setShowExtracted(true);
    const nextBody = buildPreviewBody(nextType, fields, tone);
    setBody(nextBody);
    rememberFields(fields);
    setEditing(false);
  };

  const handleExample = (nextType) => {
    setPrompt(getSample(nextType).prompt);
  };

  const applyRegistered = (nextType, nextFields, sourceBody) => {
    const nextBody = buildPreviewBody(nextType, nextFields, tone, sourceBody);
    setDocumentType(nextType);
    setFields(nextFields);
    rememberFields(nextFields);
    setBody(nextBody);
    setShowExtracted(true);
    setEditing(false);
  };

  const fallbackRegister = (userPrompt) => {
    const nextType = inferTypeFromPrompt(userPrompt);
    applyRegistered(nextType, { ...emptyFields(), ...getSample(nextType).fields });
  };

  const handleRegister = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      showError("문서 내용을 먼저 입력해 주세요.");
      return;
    }

    setLoadingMessage("정보를 등록하는 중");

    try {
      const raw = await generate(
        buildRegisterPrompt({
          prompt: userPrompt,
          showSignature,
        }),
      );
      const parsed = parseAIJson(raw);
      const nextType = resolveType(parsed.documentType, userPrompt);
      const nextFields = { ...emptyFields(), ...(parsed.fields ?? {}) };
      if (!hasFieldValues(nextFields)) {
        throw new Error("추출된 정보가 없습니다.");
      }
      applyRegistered(nextType, nextFields, parsed.body);
    } catch (err) {
      fallbackRegister(userPrompt);
      showError(
        err?.message
          ? `정보 등록에 실패해 예시 정보로 채웠습니다. (${err.message})`
          : "정보 등록에 실패해 예시 정보로 채웠습니다.",
      );
    }
  };

  const fallbackExtract = (nextType = documentType) => {
    const resolved = resolveType(nextType, prompt);
    const nextFields = { ...emptyFields(), ...getSample(resolved).fields };
    setDocumentType(resolved);
    setFields(nextFields);
    rememberFields(nextFields);
    setBody(buildPreviewBody(resolved, nextFields, tone));
    setShowExtracted(true);
  };

  const fallbackRewrite = (nextTone) => {
    const sample = getSample(documentType);
    setBody(sample.body[nextTone] ?? sample.body.polite);
  };

  const handleGenerate = async () => {
    const userPrompt = prompt.trim() || SAMPLE_PROMPT;
    if (!prompt.trim()) setPrompt(SAMPLE_PROMPT);
    setLoadingMessage("문서를 작성하는 중");

    try {
      const raw = await generate(
        buildExtractPrompt({
          prompt: userPrompt,
          tone,
          companyStyle,
          showSignature,
        }),
      );
      const parsed = parseAIJson(raw);
      const nextType = resolveType(parsed.documentType, userPrompt);
      const nextFields = { ...emptyFields(), ...(parsed.fields ?? {}) };
      setDocumentType(nextType);
      setFields(nextFields);
      rememberFields(nextFields);
      setBody(buildPreviewBody(nextType, nextFields, tone, parsed.body));
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
          : "AI 작성에 실패해 예시 문서로 채웠습니다.",
      );
    }
  };

  const handleRewrite = async (nextTone) => {
    setTone(nextTone);
    setLoadingMessage("문체를 바꾸는 중");
    const source = body.trim();

    if (!source) {
      fallbackRewrite(nextTone);
      return;
    }

    try {
      const raw = await generate(
        buildRewritePrompt({ body: source, tone: nextTone }),
      );
      const parsed = parseAIJson(raw);
      setBody(parsed.body || source);
      setEditing(false);
    } catch (err) {
      fallbackRewrite(nextTone);
      showError(
        err?.message
          ? `문체 변경에 실패해 예시 문장으로 바꿨습니다. (${err.message})`
          : "문체 변경에 실패해 예시 문장으로 바꿨습니다.",
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
          companyName,
          stampImage,
          stampAtCenter,
          stampAtName,
          showDepartment,
          showSignature,
          showStamp,
        }),
      );
      showInfo("현재 문서를 저장했습니다.", "success");
    } catch {
      showError("저장에 실패했습니다.");
    }
  };

  return {
    loading,
    loadingMessage,
    toast,
    closeToast,
    category,
    setCategory,
    documentType,
    handleTypeChange,
    handleExample,
    handleRegister,
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
    companyName,
    setCompanyName,
    showDepartment,
    setShowDepartment,
    showSignature,
    setShowSignature,
    showStamp,
    setShowStamp,
    stampAtCenter,
    setStampAtCenter,
    stampAtName,
    setStampAtName,
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
