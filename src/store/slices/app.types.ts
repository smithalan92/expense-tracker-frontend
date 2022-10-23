import { Currency, LoginUser } from "@/api.types";

export interface AppState {
  user: LoginUser | null;
  isLoggingIn: boolean;
  hasFailedToLogin: boolean;
  currencies: Currency[];
  isLoadingCurrencies: boolean;
  hasFailedToLoadCurrencies: boolean;
}

export interface LoginThunkParams {
  email: string;
  password: string;
}
