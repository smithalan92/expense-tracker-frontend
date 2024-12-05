import { login, type LoginUser } from "@/api";
import { acceptHMRUpdate, defineStore } from "pinia";

const useUserStore = defineStore("user", {
  state: (): UserState => ({ user: null, authToken: null }),
  getters: {
    isLoggedIn: (state) => state.authToken !== null,
  },
  actions: {
    async loginUser({ email, password }: { email: string; password: string }) {
      const data = await login({ email, password });
      this.user = data.user;
      this.authToken = data.token.token;
    },
    logout() {
      this.user = null;
      this.authToken = null;
    },
  },
});

export default useUserStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

interface UserState {
  user: LoginUser | null;
  authToken: string | null;
}
