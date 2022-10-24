import format from "date-fns/format";

export function formatDateForStoring(date: Date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}
