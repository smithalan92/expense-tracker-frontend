import { format } from "date-fns/format";
import { parse } from "date-fns/parse";

export function getTripCoverStyle(image?: string) {
  const style: Record<string, string> = { "--cover-h": "350" };
  if (image) {
    style.backgroundImage = `linear-gradient(180deg, oklch(0 0 0 / 0.1) 0%, oklch(0 0 0 / 0.45) 42%, oklch(0 0 0 / 0.92) 100%), url(${image})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
  }
  return style;
}

export function formatDateRange(start: string, end: string): string {
  const fmt = "dd MMM yyyy";
  const a = parse(start, fmt, new Date());
  const b = parse(end, fmt, new Date());
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  if (sameMonth) return `${format(a, "MMM d")}–${format(b, "d, yyyy")}`;
  const sameYear = a.getFullYear() === b.getFullYear();
  if (sameYear) return `${format(a, "MMM d")} – ${format(b, "MMM d, yyyy")}`;
  return `${format(a, "MMM d, yyyy")} – ${format(b, "MMM d, yyyy")}`;
}
