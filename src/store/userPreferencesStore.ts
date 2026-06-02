import { acceptHMRUpdate, defineStore } from "pinia";

const useUserPreferencesStore = defineStore("userPreferences", {
  state: (): UserPreferencesState => ({}),
  persist: true,
});

export default useUserPreferencesStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserPreferencesStore, import.meta.hot));
}

interface UserPreferencesState {}
