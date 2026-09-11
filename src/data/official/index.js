import {
  COMMON_FIELDS,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
  PREVIEW_TEMPLATES,
  TONES,
} from "./documentTypes";
import { EXAMPLE_CHIPS, SAMPLE_PROMPT, SAMPLE_PROMPTS, SAMPLES, getSample } from "./samples";

export {
  COMMON_FIELDS,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
  EXAMPLE_CHIPS,
  PREVIEW_TEMPLATES,
  SAMPLE_PROMPT,
  SAMPLE_PROMPTS,
  SAMPLES,
  TONES,
  getSample,
};

export function findType(documentType) {
  return (
    DOCUMENT_TYPES.find((item) => item.id === documentType) ?? DOCUMENT_TYPES[0]
  );
}

export function emptyFields() {
  const keys = new Set(["department", "signerName"]);
  DOCUMENT_TYPES.forEach((type) => {
    type.fields.forEach((field) => keys.add(field.key));
  });
  return Object.fromEntries([...keys].map((key) => [key, ""]));
}

export function isImageField(field) {
  return field?.type === "image";
}

export function isImageFieldKey(key) {
  return DOCUMENT_TYPES.some((type) =>
    type.fields.some((field) => field.key === key && isImageField(field)),
  );
}

export function isCardType(documentType) {
  return (
    documentType === "wedding" ||
    documentType === "obituary" ||
    documentType === "thanks"
  );
}

export function mergeExtractedFields(parsedFields, previousFields = {}) {
  const next = { ...emptyFields(), ...(parsedFields ?? {}) };

  DOCUMENT_TYPES.forEach((type) => {
    type.fields.forEach((field) => {
      if (!isImageField(field)) return;
      const previous = previousFields[field.key];
      next[field.key] = String(previous ?? "").startsWith("data:")
        ? previous
        : "";
    });
  });

  return next;
}

export function applySample(documentType) {
  const sample = getSample(documentType);
  return {
    prompt: sample.prompt,
    fields: { ...emptyFields(), ...sample.fields },
    body: sample.body.polite,
  };
}
