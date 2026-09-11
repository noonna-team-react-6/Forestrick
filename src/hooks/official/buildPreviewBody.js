import { getSample, isImageField, findType } from "../../data/official";
import { applyFieldToBody } from "./applyFieldToBody";
import { stripFactList } from "./proofreadBody";

export function buildPreviewBody(documentType, fields, tone, sourceBody) {
  const sample = getSample(documentType);
  const type = findType(documentType);
  let nextBody = String(
    sourceBody || sample.body[tone] || sample.body.polite || "",
  );

  for (const [key, sampleValue] of Object.entries(sample.fields)) {
    const field = type.fields.find((item) => item.key === key);
    if (isImageField(field)) continue;
    const nextValue = fields?.[key];
    if (!String(nextValue ?? "").trim()) continue;
    nextBody = applyFieldToBody(nextBody, sampleValue, nextValue).body;
  }

  nextBody = stripFactList(nextBody);
  if (documentType === "wedding" || documentType === "obituary" || documentType === "thanks") {
    return nextBody;
  }

  const extra = String(fields?.extra ?? "").trim();
  if (extra && !nextBody.includes(extra)) {
    nextBody = `${nextBody}\n\n${extra}`;
  }

  return nextBody;
}
