import { useToast as _useToast } from "vue-toast-notification";

export function useToast() {
  const $toast = _useToast({
    position: "top",
    duration: 5000,
    dismissible: true,
  });

  return $toast;
}
