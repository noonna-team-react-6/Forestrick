import { useMemo, useRef, useState } from "react";
import { applyFieldToBody, rewriteObituaryAnnouncement } from "./applyFieldToBody";
import { buildPreviewBody } from "./buildPreviewBody";
import { proofreadAndVary, stripFactList } from "./proofreadBody";
import {
  DOCUMENT_TYPES,
  SAMPLE_PROMPTS,
  emptyFields,
  findType,
  getSample,
  isCardType,
  isImageFieldKey,
  mergeExtractedFields,
} from "../../data/official";
import {
  buildExtractPrompt,
  buildProofreadPrompt,
  buildRegisterPrompt,
  buildRewritePrompt,
  inferTypeFromPrompt,
  parseAIJson,
  resolveRecommendedDesigns,
} from "../../pages/official/officialAi";
import useDocuments from "../useDocuments";
import { useAI } from "../useAI";

const TONE_IDS = ["polite", "formal", "concise"];

function resolveType(id, prompt, category) {
  if (
    DOCUMENT_TYPES.some(
      (item) => item.id === id && (!category || item.category === category),
    )
  ) {
    return id;
  }
  return inferTypeFromPrompt(prompt, category);
}

function hasFieldValues(fields) {
  return Object.entries(fields).some(([key, value]) => {
    if (isImageFieldKey(key) || String(value ?? "").startsWith("data:")) {
      return false;
    }
    return String(value ?? "").trim();
  });
}

export function useOfficialDocument() {
  const { generate, loading } = useAI("gemini");
  const { addDocument, updateDocument } = useDocuments();
  const [sessionLoading, setSessionLoading] = useState(false);
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
  const [previewTemplateId, setPreviewTemplateId] = useState(null);
  const [showDesigns, setShowDesigns] = useState(false);
  const [recommendedDesigns, setRecommendedDesigns] = useState([
    "classic",
    "modern",
    "minimal",
  ]);
  const syncedFieldsRef = useRef(emptyFields());
  const savedDocumentIdRef = useRef(null);
  const savedSnapshotRef = useRef(null);

  const rememberFields = (nextFields) => {
    syncedFieldsRef.current = nextFields;
  };

  const beginNewDocument = () => {
    savedDocumentIdRef.current = null;
    savedSnapshotRef.current = null;
  };

  const type = useMemo(() => findType(documentType), [documentType]);
  const visibleFields = type.fields;
  const resolvedTemplateId =
    previewTemplateId ?? type.previewTemplateId ?? "classic";

  const closeToast = () => setToast(null);

  const showError = (message) => {
    setToast({ kind: "error", message });
  };

  const showInfo = (message, kind = "default") => {
    setToast({ kind, message });
  };

  const updateField = (key, value) => {
    const previous = syncedFieldsRef.current[key];
    const nextFields = { ...syncedFieldsRef.current, [key]: value };
    setFields((prev) => ({ ...prev, [key]: value }));
    rememberFields(nextFields);

    if (isImageFieldKey(key) || String(value ?? "").startsWith("data:")) {
      return;
    }

    setBody((current) => {
      if (
        documentType === "obituary" &&
        (key === "deceasedName" || key === "relationship")
      ) {
        return rewriteObituaryAnnouncement(current, nextFields);
      }

      const patched = applyFieldToBody(current, previous, value);
      if (patched.didSync) return patched.body;
      return current;
    });
  };

  const revealDesigns = (parsed, typeId) => {
    const resolved = Array.isArray(parsed?.designs)
      ? {
          designs: parsed.designs,
          previewTemplateId:
            parsed.previewTemplateId ?? parsed.designs[0] ?? "classic",
        }
      : resolveRecommendedDesigns(parsed, typeId);
    setRecommendedDesigns(resolved.designs);
    setPreviewTemplateId(resolved.previewTemplateId);
    setShowDesigns(true);
  };

  const handleTypeChange = (nextType) => {
    setDocumentType(nextType);
    setShowExtracted(true);
    const nextBody = buildPreviewBody(nextType, fields, tone);
    setBody(nextBody);
    rememberFields(fields);
    setEditing(false);
    setShowDesigns(false);
    setPreviewTemplateId(findType(nextType).previewTemplateId ?? "classic");
  };

  const handleExample = (nextType) => {
    setPrompt(getSample(nextType).prompt);
  };

  const applyRegistered = (nextType, nextFields, sourceBody, designSource) => {
    const nextBody = buildPreviewBody(nextType, nextFields, tone, sourceBody);
    setDocumentType(nextType);
    setFields(nextFields);
    rememberFields(nextFields);
    setBody(nextBody);
    setShowExtracted(true);
    setEditing(false);
    revealDesigns(designSource, nextType);
    beginNewDocument();
  };

  const fallbackRegister = (userPrompt) => {
    const nextType = inferTypeFromPrompt(userPrompt, category);
    applyRegistered(
      nextType,
      mergeExtractedFields(getSample(nextType).fields, fields),
    );
  };

  const runRegister = async (userPrompt) => {
    const raw = await generate(
      buildRegisterPrompt({
        prompt: userPrompt,
        showSignature: isCardType(inferTypeFromPrompt(userPrompt, category))
          ? false
          : showSignature,
      }),
    );
    const parsed = parseAIJson(raw);
    const nextType = resolveType(parsed.documentType, userPrompt, category);
    const nextFields = mergeExtractedFields(parsed.fields, fields);
    if (!hasFieldValues(nextFields)) {
      throw new Error("추출된 정보가 없습니다.");
    }
    const designs = resolveRecommendedDesigns(parsed, nextType);
    return {
      nextType,
      nextFields,
      nextBody: buildPreviewBody(nextType, nextFields, tone, parsed.body),
      designs,
    };
  };

  const handleRegister = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      showError("문서 내용을 먼저 입력해 주세요.");
      return;
    }

    setLoadingMessage("정보를 등록하는 중");

    try {
      const registered = await runRegister(userPrompt);
      applyRegistered(
        registered.nextType,
        registered.nextFields,
        registered.nextBody,
        registered.designs,
      );
    } catch (err) {
      fallbackRegister(userPrompt);
      showError(
        err?.message
          ? `정보 등록에 실패해 예시 정보로 채웠습니다. (${err.message})`
          : "정보 등록에 실패해 예시 정보로 채웠습니다.",
      );
    }
  };

  const fallbackRewrite = (nextTone) => {
    const sample = getSample(documentType);
    setBody(sample.body[nextTone] ?? sample.body.polite);
  };

  const polishBody = async (draftBody, typeId = documentType) => {
    setLoadingMessage("문법을 다듬는 중");
    try {
      const raw = await generate(buildProofreadPrompt(draftBody, typeId));
      const parsed = parseAIJson(raw);
      return proofreadAndVary(parsed.body || draftBody, {
        skipPhraseSwap: typeId === "obituary",
      });
    } catch {
      return proofreadAndVary(draftBody, {
        skipPhraseSwap: typeId === "obituary",
      });
    }
  };

  const handleGenerate = async () => {
    const fallbackPrompt = SAMPLE_PROMPTS[category] ?? SAMPLE_PROMPTS.official;
    const userPrompt = prompt.trim() || fallbackPrompt;
    if (!prompt.trim()) setPrompt(fallbackPrompt);
    setSessionLoading(true);
    setLoadingMessage("정보를 등록하는 중");

    try {
      const looksCard =
        isCardType(documentType) ||
        isCardType(inferTypeFromPrompt(userPrompt, category));
      let created;

      try {
        created = await runRegister(userPrompt);
      } catch {
        try {
          const raw = await generate(
            buildExtractPrompt({
              prompt: userPrompt,
              tone,
              companyStyle: looksCard ? false : companyStyle,
              showSignature: looksCard ? false : showSignature,
            }),
          );
          const parsed = parseAIJson(raw);
          const nextType = resolveType(parsed.documentType, userPrompt, category);
          const nextFields = mergeExtractedFields(parsed.fields, fields);
          created = {
            nextType,
            nextFields,
            nextBody: buildPreviewBody(nextType, nextFields, tone, parsed.body),
            designs: resolveRecommendedDesigns(parsed, nextType),
            usedFallback: false,
            fallbackMessage: "",
          };
          if (parsed.tone && TONE_IDS.includes(parsed.tone)) {
            setTone(parsed.tone);
          }
        } catch (err) {
          const nextType = resolveType(documentType, userPrompt, category);
          const filledFields = Object.fromEntries(
            Object.entries(fields).filter(([, value]) =>
              String(value ?? "").trim(),
            ),
          );
          const nextFields = mergeExtractedFields(
            {
              ...getSample(nextType).fields,
              ...filledFields,
            },
            fields,
          );
          created = {
            nextType,
            nextFields,
            nextBody: buildPreviewBody(nextType, nextFields, tone),
            usedFallback: true,
            fallbackMessage: err?.message
              ? `AI 작성에 실패해 예시 문서로 채웠습니다. (${err.message})`
              : "AI 작성에 실패해 예시 문서로 채웠습니다.",
          };
        }
      }

      const nextBody = await polishBody(created.nextBody, created.nextType);

      setDocumentType(created.nextType);
      setFields(created.nextFields);
      rememberFields(created.nextFields);
      setBody(nextBody);
      revealDesigns(created.designs, created.nextType);
      setShowExtracted(true);
      setEditing(false);
      beginNewDocument();

      if (created.usedFallback) {
        showError(created.fallbackMessage);
      }
    } finally {
      setSessionLoading(false);
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
        buildRewritePrompt({ body: source, tone: nextTone, documentType }),
      );
      const parsed = parseAIJson(raw);
      setBody(stripFactList(parsed.body || source));
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

  const buildSavePayload = () => ({
    title: documentType ? type.title : "공식 문서",
    category: documentType ? type.label : "공식 문서",
    source: "official",
    content: body,
    prompt,
    documentType,
    fields,
    tone,
    companyStyle,
    companyName,
    showDepartment,
    showSignature,
    showStamp,
    stampAtCenter,
    stampAtName,
    stampImage,
    previewTemplateId: resolvedTemplateId,
  });

  const handleSave = () => {
    if (!body.trim() && !documentType) {
      showError("저장할 문서가 없습니다.");
      return;
    }

    const payload = buildSavePayload();
    const snapshot = JSON.stringify(payload);

    try {
      if (savedDocumentIdRef.current) {
        if (savedSnapshotRef.current === snapshot) {
          showInfo("이미 저장된 문서입니다.");
          return;
        }

        updateDocument(savedDocumentIdRef.current, payload);
        savedSnapshotRef.current = snapshot;
        showInfo("현재 문서를 저장했습니다.", "success");
        return;
      }

      const saved = addDocument(payload);
      savedDocumentIdRef.current = saved.id;
      savedSnapshotRef.current = snapshot;
      showInfo("현재 문서를 저장했습니다.", "success");
    } catch {
      showError("저장에 실패했습니다.");
    }
  };

  return {
    loading: loading || sessionLoading,
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
    handleSave,
    showInfo,
    showError,
    previewTemplateId: resolvedTemplateId,
    setPreviewTemplateId,
    showDesigns,
    recommendedDesigns,
  };
}
