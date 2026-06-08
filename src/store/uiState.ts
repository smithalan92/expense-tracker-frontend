import type { TripExpense } from "@/api/expense";
import type { Trip } from "@/api/trip";
import { acceptHMRUpdate, defineStore } from "pinia";

const useUIStateStore = defineStore("ui", {
  state: (): UIState => ({
    isAddingOrEditingTrip: false,
    activeTrip: null,
    isViewingExpense: false,
    isAddingOrEditingExpense: false,
    activeExpense: null,
  }),
  actions: {
    setIsAddingOrEditingTrip(value: boolean) {
      this.isAddingOrEditingTrip = value;
    },
    setActiveTrip(trip: Trip | null) {
      this.activeTrip = trip;
    },
    setIsViewingExpense(value: boolean) {
      this.isViewingExpense = value;
    },
    setIsAddingOrEditingExpense(value: boolean) {
      this.isAddingOrEditingExpense = value;
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
  isAddingOrEditingTrip: boolean;
  activeTrip: Trip | null;
  isViewingExpense: boolean;
  isAddingOrEditingExpense: boolean;
  activeExpense: TripExpense | null;
}
