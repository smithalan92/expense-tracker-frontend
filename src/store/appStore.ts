import loadAppData, { type CountryWithCurrency, type Currency, type User } from "@/api/app";
import { createInstance } from "@/api/axios";
import { login, type LoginUser } from "@/api/user";
import { isNetworkError } from "@/utils/network";
import { acceptHMRUpdate, defineStore } from "pinia";

const useAppStore = defineStore("app", {
  state: (): AppState => ({
    user: null,
    lastCurrencySyncDateTime: "<unknown>",
    authToken: null,
    users: [],
    countries: [],
    currencies: [],
    userPreferences: {},
  }),
  getters: {
    isLoggedIn: (state) => state.authToken !== null,
    shouldUseAddExpenseWizard: (state) => state.userPreferences?.useAddExpenseWizard ?? false,
  },
  actions: {
    async loginUser({ email, password }: { email: string; password: string }) {
      const { token, user } = await login({ email, password });
      createInstance(token.token);
      this.user = user;
      this.authToken = token.token;
      this.loadAppData();
    },
    logout() {
      this.user = null;
      this.authToken = null;
      localStorage.clear();
    },

    async loadAppData() {
      try {
        const { users, countries, currencies, lastCurrencySyncDateTime } = await loadAppData();
        this.users = users;
        this.countries = countries;
        this.currencies = currencies;
        this.lastCurrencySyncDateTime = lastCurrencySyncDateTime;
      } catch (err: any) {
        if (!isNetworkError(err)) {
          console.log(err);
        }
      }
    },

    setUseAddExpenseWizard(shouldUse: boolean) {
      this.userPreferences.useAddExpenseWizard = shouldUse;
    },
  },
  persist: true,
});

export default useAppStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}

interface AppState {
  authToken: Nullable<string>;
  countries: CountryWithCurrency[];
  currencies: Currency[];
  user: Nullable<LoginUser>;
  users: User[];
  lastCurrencySyncDateTime: string;
  userPreferences: Record<string, boolean>;
}
