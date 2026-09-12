export default function formatDocumentDate(value) {
  if (!value) return "정보 없음";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date();
  const differenceInMinutes = Math.floor((now.getTime() - date.getTime()) / 60_000);

  if (differenceInMinutes < 1) return "방금 전";
  if (differenceInMinutes < 60) return `${differenceInMinutes}분 전`;

  const isToday = now.toDateString() === date.toDateString();
  if (isToday) {
    return `오늘 ${new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)}`;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
