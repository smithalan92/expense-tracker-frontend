import loadAppData, { type CountryWithCurrency } from "@/api/app";
import { createInstance } from "@/api/axios";
import { login, type LoginUser, type User } from "@/api/user";
import { isNetworkError } from "@/utils/network";
import { acceptHMRUpdate, defineStore } from "pinia";

const useAppStore = defineStore("app", {
  state: (): AppState => ({ user: null, authToken: null, users: [], countries: [] }),
  getters: {
    isLoggedIn: (state) => state.authToken !== null,
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
    },

    async loadAppData() {
      try {
        const { users, countries } = await loadAppData();
        this.users = users;
        this.countries = countries;
      } catch (err: any) {
        if (!isNetworkError(err)) {
          console.log(err);
        }
      }
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
  user: Nullable<LoginUser>;
  users: User[];
}
