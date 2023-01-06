import format from "date-fns/format";

export function formatDateForExpense(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export function formatDateForTrip(date: Date) {
  return format(date, "yyyy-MM-dd");
}
