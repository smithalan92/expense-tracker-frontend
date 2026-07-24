import type { TripExpense } from "@/api/expense";
import type { Trip, TripCountry } from "@/api/trip";
import { acceptHMRUpdate, defineStore } from "pinia";

const useUIStateStore = defineStore("ui", {
  state: (): UIState => ({
    isAddingTrip: false,
    tripToEdit: null,
    isAddingExpense: false,
    expenseToView: null,
    expenseToEdit: null,
    expenseToCopy: null,
  }),
  actions: {
    setIsAddingTrip(value: boolean) {
      this.isAddingTrip = value;
    },
    setTripToEdit(data: Nullable<ActiveTripData>) {
      this.tripToEdit = data;
    },
    setIsAddingExpense(value: boolean) {
      this.isAddingExpense = value;
    },
    setExpenseToView(value: Nullable<TripExpense>) {
      this.expenseToView = value;
    },
    setExpenseToEdit(value: Nullable<TripExpense>) {
      this.expenseToEdit = value;
    },
    setExpenseToCopy(value: Nullable<TripExpense>) {
      this.expenseToCopy = value;
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
  isAddingTrip: boolean;
  tripToEdit: Nullable<ActiveTripData>;
  isAddingExpense: boolean;
  expenseToView: Nullable<TripExpense>;
  expenseToEdit: Nullable<TripExpense>;
  expenseToCopy: Nullable<TripExpense>;
}
