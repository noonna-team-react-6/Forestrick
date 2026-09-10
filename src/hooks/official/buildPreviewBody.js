import { getSample } from "../../pages/official/Mock";
import { applyFieldToBody } from "./applyFieldToBody";

export function buildPreviewBody(documentType, fields, tone, sourceBody) {
  const sample = getSample(documentType);
  let nextBody = String(
    sourceBody || sample.body[tone] || sample.body.polite || "",
  );

  for (const [key, sampleValue] of Object.entries(sample.fields)) {
    const nextValue = fields?.[key];
    if (!String(nextValue ?? "").trim()) continue;
    nextBody = applyFieldToBody(nextBody, sampleValue, nextValue).body;
  }

  return nextBody;
}
