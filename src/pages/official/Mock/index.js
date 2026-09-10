import {
  COMMON_FIELDS,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
  PREVIEW_TEMPLATES,
  TONES,
} from "./documentTypes";
import { EXAMPLE_CHIPS, SAMPLE_PROMPT, SAMPLES, getSample } from "./samples";

export {
  COMMON_FIELDS,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
  EXAMPLE_CHIPS,
  PREVIEW_TEMPLATES,
  SAMPLE_PROMPT,
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
  return {
    deceasedName: "",
    relationship: "",
    funeralHome: "",
    funeralDate: "",
    groomsName: "",
    bridesName: "",
    venue: "",
    date: "",
    recipient: "",
    reason: "",
    title: "",
    datetime: "",
    originalDate: "",
    newDate: "",
    extra: "",
    department: "",
    signerName: "",
  };
}

export function applySample(documentType) {
  const sample = getSample(documentType);
  return {
    prompt: sample.prompt,
    fields: { ...emptyFields(), ...sample.fields },
    body: sample.body.polite,
  };
}
