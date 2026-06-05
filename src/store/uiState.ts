import type { TripExpense } from "@/api/expense";
import { acceptHMRUpdate, defineStore } from "pinia";

const useUIStateStore = defineStore("ui", {
  state: (): UIState => ({
    isViewingExpense: false,
    isEditingExpense: false,
    activeExpense: null,
  }),
  actions: {
    setIsViewingExpense(value: boolean) {
      this.isViewingExpense = value;
    },
    setIsEditingExpense(value: boolean) {
      this.isEditingExpense = value;
      if (value) this.isViewingExpense = false; // Close the view panel
    },
    setActiveExpense(expense: TripExpense | null) {
      this.activeExpense = expense;
    },
  },
  persist: false,
});

export default useUIStateStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStateStore, import.meta.hot));
}

interface UIState {
  isViewingExpense: boolean;
  isEditingExpense: boolean;
  activeExpense: TripExpense | null;
}
