import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DEFAULT_DOCUMENT_TITLE = "공문";

const sanitizeFileName = (fileName) => {
  return (fileName || DEFAULT_DOCUMENT_TITLE).replace(
    /[\\/:*?"<>|]/g,
    "_"
  );
};

export const downloadOfficialDocumentAsPdf = async (title, documentText) => {
  const container = window.document.createElement("div");

  const width = 720;

  container.style.cssText = `
    position: absolute;
    top: -10000px;
    left: -10000px;
    pointer-events: none;
    box-sizing: border-box;
    width: ${width}px;
    padding: 48px;
    background: #ffffff;
    color: #111827;
    font-family: Pretendard, "Malgun Gothic", sans-serif;
    font-size: 14px;
    line-height: 1.9;
    white-space: pre-wrap;
    word-break: break-word;
  `;
  container.textContent = documentText;

  window.document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 2,
    width,
    windowWidth: width,
    height: container.scrollHeight,
    windowHeight: container.scrollHeight,
  });

  window.document.body.removeChild(container);

  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "l" : "p",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${sanitizeFileName(title)}.pdf`);
};
