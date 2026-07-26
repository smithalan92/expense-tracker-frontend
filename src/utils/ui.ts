import type { User } from "@/api/app";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function getAvatarStyles(user: User) {
  const firstLetter = user.firstName.slice(0, 1).toLowerCase();

  switch (firstLetter) {
    case "a":
      return { bg: "bg-emerald-800 text-emerald-100 ring-emerald-900", icon: "text-emerald-800" };
    case "b":
      return { bg: "bg-blue-700 text-blue-100 ring-blue-900", icon: "text-blue-700" };
    case "c":
      return { bg: "bg-violet-700 text-violet-100 ring-violet-900", icon: "text-violet-700" };
    case "d":
      return { bg: "bg-rose-700 text-rose-100 ring-rose-900", icon: "text-rose-700" };
    case "e":
      return { bg: "bg-amber-700 text-amber-100 ring-amber-900", icon: "text-amber-700" };
    case "f":
      return { bg: "bg-teal-700 text-teal-100 ring-teal-900", icon: "text-teal-700" };
    case "g":
      return { bg: "bg-indigo-700 text-indigo-100 ring-indigo-900", icon: "text-indigo-700" };
    case "h":
      return { bg: "bg-pink-700 text-pink-100 ring-pink-900", icon: "text-pink-700" };
    case "i":
      return { bg: "bg-cyan-700 text-cyan-100 ring-cyan-900", icon: "text-cyan-700" };
    case "j":
      return { bg: "bg-orange-700 text-orange-100 ring-orange-900", icon: "text-orange-700" };
    case "k":
      return { bg: "bg-lime-700 text-lime-100 ring-lime-900", icon: "text-lime-700" };
    case "l":
      return { bg: "bg-fuchsia-700 text-fuchsia-100 ring-fuchsia-900", icon: "text-fuchsia-700" };
    case "m":
      return { bg: "bg-sky-700 text-sky-100 ring-sky-900", icon: "text-sky-700" };
    case "n":
      return { bg: "bg-red-800 text-red-100 ring-red-900", icon: "text-red-800" };
    case "o":
      return { bg: "bg-green-700 text-green-100 ring-green-900", icon: "text-green-700" };
    case "p":
      return { bg: "bg-purple-700 text-purple-100 ring-purple-900", icon: "text-purple-700" };
    case "q":
      return { bg: "bg-yellow-700 text-yellow-100 ring-yellow-900", icon: "text-yellow-700" };
    case "r":
      return { bg: "bg-purple-800 text-purple-100 ring-purple-900", icon: "text-purple-200" };
    case "s":
      return { bg: "bg-emerald-700 text-emerald-100 ring-emerald-900", icon: "text-emerald-700" };
    case "t":
      return { bg: "bg-violet-800 text-violet-100 ring-violet-900", icon: "text-violet-800" };
    case "u":
      return { bg: "bg-rose-800 text-rose-100 ring-rose-900", icon: "text-rose-800" };
    case "v":
      return { bg: "bg-teal-800 text-teal-100 ring-teal-900", icon: "text-teal-800" };
    case "w":
      return { bg: "bg-indigo-800 text-indigo-100 ring-indigo-900", icon: "text-indigo-800" };
    case "x":
      return { bg: "bg-fuchsia-800 text-fuchsia-100 ring-fuchsia-900", icon: "text-fuchsia-800" };
    case "y":
      return { bg: "bg-cyan-800 text-cyan-100 ring-cyan-900", icon: "text-cyan-800" };
    case "z":
      return { bg: "bg-orange-800 text-orange-100 ring-orange-900", icon: "text-orange-800" };
    default:
      return { bg: "bg-gray-700 text-gray-100 ring-gray-900", icon: "text-gray-700" };
  }
}
