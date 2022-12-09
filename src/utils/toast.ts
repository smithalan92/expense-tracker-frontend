import { toast } from "react-toastify";

const TOAST_STYLES = {
  info: {
    body: "text-gray-700",
    progress: { background: "rgb(55 65 81)" },
  },
  success: {
    body: "text-green-600",
    progress: { background: "rgb(22 163 74)" },
  },
  error: {
    body: "text-red-600",
    progress: { background: "rgb(220 38 38)" },
  },
};

interface ShowToastOptions {
  type?: "info" | "success" | "error";
}

export function showToast(text: string, options?: ShowToastOptions) {
  const type = options?.type ?? "info";
  const style = TOAST_STYLES[type];
  toast(text, {
    bodyClassName: style.body,
    progressStyle: style.progress,
  });
}
