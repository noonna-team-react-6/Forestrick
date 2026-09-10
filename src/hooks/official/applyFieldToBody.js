function pad(value) {
  return String(value).padStart(2, "0");
}

function parseDateParts(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;

  const dotted = text.match(
    /^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?$/,
  );
  if (dotted) {
    return {
      y: dotted[1],
      mo: Number(dotted[2]),
      d: Number(dotted[3]),
      h: dotted[4] != null ? Number(dotted[4]) : null,
      min: dotted[5] != null ? Number(dotted[5]) : null,
    };
  }

  const korean = text.match(
    /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일(?:\s+(\d{1,2})(?::(\d{2})|시))?/,
  );
  if (korean) {
    return {
      y: korean[1],
      mo: Number(korean[2]),
      d: Number(korean[3]),
      h: korean[4] != null ? Number(korean[4]) : null,
      min: korean[5] != null ? Number(korean[5]) : null,
    };
  }

  return null;
}

function formatDate(parts, style) {
  const { y, mo, d, h, min } = parts;
  const mm = pad(mo);
  const dd = pad(d);
  const hh = h != null ? pad(h) : null;
  const mi = pad(min ?? 0);

  switch (style) {
    case "koreanTime":
      return hh ? `${y}년 ${mo}월 ${d}일 ${hh}:${mi}` : `${y}년 ${mo}월 ${d}일`;
    case "koreanSi":
      return h != null ? `${y}년 ${mo}월 ${d}일 ${h}시` : `${y}년 ${mo}월 ${d}일`;
    case "dottedTime":
      return hh ? `${y}.${mm}.${dd} ${hh}:${mi}` : `${y}.${mm}.${dd}`;
    case "korean":
      return `${y}년 ${mo}월 ${d}일`;
    case "koreanPad":
      return `${y}년 ${mm}월 ${dd}일`;
    case "monthDay":
      return `${mo}월 ${d}일`;
    case "dotted":
      return `${y}.${mm}.${dd}`;
    case "dottedShort":
      return `${y}.${mo}.${d}`;
    case "dashed":
      return `${y}-${mm}-${dd}`;
    case "slashed":
      return `${y}/${mm}/${dd}`;
    default:
      return `${y}.${mm}.${dd}`;
  }
}

function dateVariants(parts) {
  const { y, mo, d, h, min } = parts;
  const mm = pad(mo);
  const dd = pad(d);
  const variants = [
    { style: "korean", text: `${y}년 ${mo}월 ${d}일` },
    { style: "koreanPad", text: `${y}년 ${mm}월 ${dd}일` },
    { style: "monthDay", text: `${mo}월 ${d}일` },
    { style: "dotted", text: `${y}.${mm}.${dd}` },
    { style: "dottedShort", text: `${y}.${mo}.${d}` },
    { style: "dashed", text: `${y}-${mm}-${dd}` },
    { style: "slashed", text: `${y}/${mm}/${dd}` },
  ];

  if (h != null) {
    const hh = pad(h);
    const mi = pad(min ?? 0);
    variants.unshift(
      { style: "koreanTime", text: `${y}년 ${mo}월 ${d}일 ${hh}:${mi}` },
      { style: "koreanSi", text: `${y}년 ${mo}월 ${d}일 ${h}시` },
      { style: "dottedTime", text: `${y}.${mm}.${dd} ${hh}:${mi}` },
    );
  }

  return variants.sort((a, b) => b.text.length - a.text.length);
}

function replaceAll(source, from, to) {
  return from ? source.split(from).join(to) : source;
}

export function applyFieldToBody(body, previousValue, nextValue) {
  const current = String(body ?? "");
  const previous = String(previousValue ?? "").trim();
  const next = String(nextValue ?? "").trim();

  if (!current || !previous || previous === next) {
    return { body: current, didSync: false };
  }

  const previousDate = parseDateParts(previous);
  const nextDate = parseDateParts(next);

  if (previousDate) {
    if (!nextDate) {
      return { body: current, didSync: false };
    }

    let updated = current;
    let changed = false;
    for (const variant of dateVariants(previousDate)) {
      if (!updated.includes(variant.text)) continue;
      updated = replaceAll(updated, variant.text, formatDate(nextDate, variant.style));
      changed = true;
    }

    return { body: updated, didSync: changed };
  }

  if (!current.includes(previous)) {
    return { body: current, didSync: false };
  }

  return { body: replaceAll(current, previous, next), didSync: true };
}
