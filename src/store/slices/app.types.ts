import { LoginUser } from "@/api.types";

export interface AppState {
  user: LoginUser | null;
  isLoggingIn: boolean;
  hasFailedToLogin: boolean;
  authToken: string;
}

export interface LoginThunkParams {
  email: string;
  password: string;
}
