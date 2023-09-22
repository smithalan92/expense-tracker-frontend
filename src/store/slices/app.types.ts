import { LoginUser } from "@/api.types";

export interface AppState {
  user: LoginUser | null;
  isLoggingIn: boolean;
  hasFailedToLogin: boolean;
  authToken: string;
  disableNativeSelectsOnMobile: boolean;
}

export interface LoginThunkParams {
  email: string;
  password: string;
}
