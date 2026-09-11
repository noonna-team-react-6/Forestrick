const PHRASE_SWAPS = [
  ["알려드립니다", "안내드립니다"],
  ["주시기 바랍니다", "주시면 감사하겠습니다"],
  ["하오니", "드리오니"],
  ["드립니다.", "올립니다."],
  ["바랍니다.", "부탁드립니다."],
  ["참석해 주시기 바랍니다", "참석해 주시면 감사하겠습니다"],
];

function cleanGrammar(body) {
  return String(body ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ {2,}/g, " ")
    .replace(/[.]{2,}/g, ".")
    .replace(/\s+([,.] )/g, "$1")
    .replace(/다요/g, "다")
    .replace(/되요/g, "돼요")
    .replace(/되서/g, "돼서")
    .trim();
}

function varyPhrases(body) {
  const candidates = PHRASE_SWAPS.filter(
    ([from, to]) => body.includes(from) || body.includes(to),
  );
  if (!candidates.length) return body;

  const [from, to] = candidates[Math.floor(Math.random() * candidates.length)];
  if (body.includes(from)) return body.split(from).join(to);
  return body.split(to).join(from);
}

function stripFactList(body) {
  let text = String(body ?? "");

  text = text.replace(/^\s*\[[^\]]+\]\s*/g, "");
  text = text.replace(/-+\s*다\s*음\s*-+\s*/g, " ");
  text = text.replace(
    /\d+\.\s*(?:일시|장소|신랑|신부|빈소|발인|수신|대상|기한|제목|예식\s*일시|예식\s*장소)[:：]?\s*[^\n]*/g,
    " ",
  );
  text = text.replace(
    /(?:^|\n)\s*(?:일시|장소|신랑|신부|빈소|발인|수신|대상)[:：]\s*[^\n]*/g,
    "\n",
  );

  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function proofreadAndVary(body, options = {}) {
  const cleaned = cleanGrammar(stripFactList(body));
  if (options.skipPhraseSwap) return cleaned;
  return varyPhrases(cleaned);
}

export { stripFactList };
