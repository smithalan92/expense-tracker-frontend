import type { User } from "@/api/app";
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

export function getAvatarBgStyles(user: User) {
  const firstLetter = user.firstName.slice(0, 1).toLowerCase();

  switch (firstLetter) {
    case "a": return "bg-emerald-800 text-emerald-100 ring-emerald-900";
    case "b": return "bg-blue-700 text-blue-100 ring-blue-900";
    case "c": return "bg-violet-700 text-violet-100 ring-violet-900";
    case "d": return "bg-rose-700 text-rose-100 ring-rose-900";
    case "e": return "bg-amber-700 text-amber-100 ring-amber-900";
    case "f": return "bg-teal-700 text-teal-100 ring-teal-900";
    case "g": return "bg-indigo-700 text-indigo-100 ring-indigo-900";
    case "h": return "bg-pink-700 text-pink-100 ring-pink-900";
    case "i": return "bg-cyan-700 text-cyan-100 ring-cyan-900";
    case "j": return "bg-orange-700 text-orange-100 ring-orange-900";
    case "k": return "bg-lime-700 text-lime-100 ring-lime-900";
    case "l": return "bg-fuchsia-700 text-fuchsia-100 ring-fuchsia-900";
    case "m": return "bg-sky-700 text-sky-100 ring-sky-900";
    case "n": return "bg-red-800 text-red-100 ring-red-900";
    case "o": return "bg-green-700 text-green-100 ring-green-900";
    case "p": return "bg-purple-700 text-purple-100 ring-purple-900";
    case "q": return "bg-yellow-700 text-yellow-100 ring-yellow-900";
    case "r": return "bg-blue-800 text-blue-100 ring-blue-900";
    case "s": return "bg-emerald-700 text-emerald-100 ring-emerald-900";
    case "t": return "bg-violet-800 text-violet-100 ring-violet-900";
    case "u": return "bg-rose-800 text-rose-100 ring-rose-900";
    case "v": return "bg-teal-800 text-teal-100 ring-teal-900";
    case "w": return "bg-indigo-800 text-indigo-100 ring-indigo-900";
    case "x": return "bg-fuchsia-800 text-fuchsia-100 ring-fuchsia-900";
    case "y": return "bg-cyan-800 text-cyan-100 ring-cyan-900";
    case "z": return "bg-orange-800 text-orange-100 ring-orange-900";
    default:  return "bg-gray-700 text-gray-100 ring-gray-900";
  }
}
