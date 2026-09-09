const DEFAULT_DOCUMENT_TITLE = "AI 생성 문서";

export const documentToPlainText = (document) => {
  const lines = [];

  if (document?.title) {
    lines.push(document.title, "");
  }

  if (document?.to) {
    lines.push(`받는 사람: ${document.to}`);
  }

  if (document?.subject) {
    lines.push(`제목: ${document.subject}`, "");
  }

  if (document?.greeting) {
    lines.push(document.greeting, "");
  }

  (document?.paragraphs || []).forEach((paragraph) => {
    lines.push(paragraph, "");
  });

  if (document?.closing) {
    lines.push(document.closing, "");
  }

  if (document?.signature) {
    lines.push(document.signature);
  }

  return lines.join("\n");
};

const sanitizeFileName = (fileName) => {
  return (fileName || DEFAULT_DOCUMENT_TITLE).replace(
    /[\\/:*?"<>|]/g,
    "_"
  );
};

export const printDocumentAsPdf = (
  title,
  documentText
) => {
  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=800"
  );

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            margin: 48px;
            color: #111827;
            font-family:
              Pretendard,
              Arial,
              sans-serif;
          }

          pre {
            white-space: pre-wrap;
            font: inherit;
            line-height: 1.9;
          }
        </style>
      </head>

      <body>
        <pre id="document-content"></pre>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.document.title =
    title || DEFAULT_DOCUMENT_TITLE;

  const contentElement =
    printWindow.document.getElementById(
      "document-content"
    );

  if (!contentElement) {
    printWindow.close();
    return;
  }

  contentElement.textContent = documentText;

  printWindow.focus();

  window.setTimeout(() => {
    printWindow.print();
  }, 250);
};

export const downloadDocumentAsText = (
  title,
  documentText
) => {
  const file = new Blob([documentText], {
    type: "text/plain;charset=utf-8",
  });

  const fileUrl = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");

  downloadLink.href = fileUrl;
  downloadLink.download = `${sanitizeFileName(title)}.txt`;
  downloadLink.click();

  URL.revokeObjectURL(fileUrl);
};

export const saveDocument = ({
  title,
  type,
  content,
}) => {
  let documents = [];

  try {
    documents = JSON.parse(
      localStorage.getItem("forestrick-documents") || "[]"
    );
  } catch {
    documents = [];
  }

  const document = {
    id: crypto.randomUUID(),
    title,
    type,
    content,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(
    "forestrick-documents",
    JSON.stringify([document, ...documents])
  );

  return document;
};
