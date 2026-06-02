import axios from "axios";

export function isNetworkError(error: Error) {
  return axios.isAxiosError(error) && error.code === "ERR_NETWORK";
}
