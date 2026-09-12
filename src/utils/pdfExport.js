function sanitizeFileName(fileName) {
  return (fileName || "문서").replace(/[\\/:*?"<>|]/g, "_");
}

/** 화면 요소를 A4 PDF 파일로 내려받는다. */
export async function downloadElementAsPdf(
  element,
  { fileName = "문서" } = {},
) {
  if (!element) {
    throw new Error("PDF로 저장할 문서를 찾을 수 없습니다.");
  }

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
  });
  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageHeight = (canvas.height * pageWidth) / canvas.width;
  let remainingHeight = imageHeight;
  let yPosition = 0;

  pdf.addImage(imageData, "PNG", 0, yPosition, pageWidth, imageHeight);
  remainingHeight -= pageHeight;

  while (remainingHeight > 0) {
    yPosition = remainingHeight - imageHeight;
    pdf.addPage();
    pdf.addImage(imageData, "PNG", 0, yPosition, pageWidth, imageHeight);
    remainingHeight -= pageHeight;
  }

  pdf.save(`${sanitizeFileName(fileName)}.pdf`);
}
