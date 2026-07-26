import { useOnline } from "@vueuse/core";
import axios from "axios";

export function isNetworkError(error: Error) {
  return axios.isAxiosError(error) && error.code === "ERR_NETWORK";
}

export function useIsOnline() {
  const online = useOnline();

  return online;
}
