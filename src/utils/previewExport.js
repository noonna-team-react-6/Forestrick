const PRINT_STYLES = `
  html, body {
    margin: 0;
    background: #fff;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 16px;
  }

  .preview-paper {
    box-shadow: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    break-inside: avoid;
  }

  img {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  @media print {
    @page {
      margin: 10mm;
    }

    html, body {
      background: #fff !important;
    }

    body {
      padding: 0;
      min-height: 0;
    }

    .preview-paper {
      margin: 0 auto !important;
    }
  }
`;

export function getPreviewText(paper) {
  if (!paper) return "";

  const clone = paper.cloneNode(true);
  clone.querySelectorAll("input, textarea").forEach((el) => {
    el.replaceWith(document.createTextNode(el.value || ""));
  });
  clone.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());

  return clone.innerText
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function preparePaperClone(paper) {
  const clone = paper.cloneNode(true);
  clone.querySelectorAll("input, textarea").forEach((el) => {
    el.replaceWith(document.createTextNode(el.value || ""));
  });
  clone.querySelectorAll("[contenteditable]").forEach((el) => {
    el.removeAttribute("contenteditable");
  });
  return clone;
}

function collectStyles() {
  return [...document.querySelectorAll("style, link[rel='stylesheet']")]
    .map((node) => node.outerHTML)
    .join("\n");
}

async function waitForPrintAssets(doc) {
  if (doc.fonts?.ready) {
    await doc.fonts.ready;
  }

  const images = [...doc.images];
  await Promise.all(
    images.map((image) => {
      if (image.complete) return undefined;
      return new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });
    }),
  );
}

export async function printPreviewPaper(paper, { title = "문서" } = {}) {
  if (!paper) {
    throw new Error("미리보기가 없습니다.");
  }

  const printWindow = window.open("", "_blank", "width=900,height=800");
  if (!printWindow) {
    throw new Error("팝업이 차단되어 인쇄할 수 없습니다.");
  }

  const clone = preparePaperClone(paper);

  printWindow.document.write(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>${String(title)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")}</title>
    ${collectStyles()}
    <style>${PRINT_STYLES}</style>
  </head>
  <body>${clone.outerHTML}</body>
</html>`);
  printWindow.document.close();

  await waitForPrintAssets(printWindow.document);
  printWindow.focus();
  printWindow.onafterprint = () => printWindow.close();
  printWindow.print();
}

