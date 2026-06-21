import type { TripExpense } from "@/api/expense";
import type { Trip, TripCountry } from "@/api/trip";
import { acceptHMRUpdate, defineStore } from "pinia";

const useUIStateStore = defineStore("ui", {
  state: (): UIState => ({
    isAddingOrEditingTrip: false,
    activeTripData: null,
    isViewingExpense: false,
    isAddingOrEditingExpense: false,
    isCopyingExpense: false,
    activeExpense: null,
  }),
  actions: {
    setIsAddingOrEditingTrip(value: boolean) {
      this.isAddingOrEditingTrip = value;
    },
    setActiveTripData(data: Nullable<ActiveTripData>) {
      this.activeTripData = data;
    },
    setIsViewingExpense(value: boolean) {
      this.isViewingExpense = value;
    },
    setIsAddingOrEditingExpense(value: boolean) {
      this.isAddingOrEditingExpense = value;
      if (value) this.isViewingExpense = false; // Close the view panel
    },
    setIsCopyingExpense(value: boolean) {
      this.isCopyingExpense = value;
      if (value) this.isViewingExpense = false;
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

interface ActiveTripData {
  trip: Trip;
  countries: TripCountry[];
  userIds: number[];
}

interface UIState {
  isAddingOrEditingTrip: boolean;
  activeTripData: Nullable<ActiveTripData>;
  isViewingExpense: boolean;
  isAddingOrEditingExpense: boolean;
  isCopyingExpense: boolean;
  activeExpense: TripExpense | null;
}
