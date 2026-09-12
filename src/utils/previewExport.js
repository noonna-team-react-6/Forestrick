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
    box-sizing: border-box;
    width: min(100%, 210mm) !important;
    max-width: 210mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
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

function safeFileName(title) {
  return String(title || "문서").replace(/[\\/:*?"<>|]+/g, "_").trim() || "문서";
}

function addCanvasToPage(doc, canvas) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 10;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;
  let imgW = maxW;
  let imgH = (canvas.height * imgW) / canvas.width;

  if (imgH > maxH) {
    imgH = maxH;
    imgW = (canvas.width * imgH) / canvas.height;
  }

  const x = margin + (maxW - imgW) / 2;
  doc.addImage(canvas, "PNG", x, margin, imgW, imgH);
}

export async function downloadPreviewPdf(paper, { title = "문서" } = {}) {
  if (!paper) {
    throw new Error("미리보기가 없습니다.");
  }

  const [{ jsPDF }, html2canvas] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const canvas = await html2canvas.default(paper, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    onclone: (clonedDoc) => {
      clonedDoc.querySelectorAll(".preview-paper").forEach((node) => {
        node.style.boxShadow = "none";
      });
      clonedDoc.querySelectorAll("input, textarea").forEach((el) => {
        el.replaceWith(clonedDoc.createTextNode(el.value || ""));
      });
      clonedDoc.querySelectorAll("[contenteditable]").forEach((el) => {
        el.removeAttribute("contenteditable");
      });
    },
  });

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  addCanvasToPage(doc, canvas);
  doc.save(`${safeFileName(title)}.pdf`);
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

