import useAppStore from "@/store/appStore";
import axios, { type AxiosInstance } from "axios";
import { CLIENT_ID, CLIENT_ID_HEADER } from "./clientId";

let http: Nullable<AxiosInstance> = null;

export const API_URL = import.meta.env.VITE_API_URL;

export function createInstance(authToken: string) {
  http = axios.create({
    baseURL: API_URL,
    headers: { Authorization: authToken, [CLIENT_ID_HEADER]: CLIENT_ID },
  });

  http.interceptors.response.use(undefined, (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const appStore = useAppStore();
        appStore.logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  });
}

export default () => http!;
