import { createInstance, loadUsers, login, type LoginUser, type User } from "@/api";
import { isNetworkError } from "@/utils/network";
import { acceptHMRUpdate, defineStore } from "pinia";

const useAppStore = defineStore("app", {
  state: (): AppState => ({ user: null, authToken: null, users: [] }),
  getters: {
    isLoggedIn: (state) => state.authToken !== null,
  },
  actions: {
    async loginUser({ email, password }: { email: string; password: string }) {
      const data = await login({ email, password });
      createInstance(data.token.token);
      this.user = data.user;
      this.authToken = data.token.token;
      this.loadAppData();
    },
    logout() {
      this.user = null;
      this.authToken = null;
    },

    async loadAppData() {
      try {
        const users = await loadUsers();
        this.users = users;
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
  user: Nullable<LoginUser>;
  users: User[];
  authToken: Nullable<string>;
}
