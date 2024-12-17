import {
  addExpenseToTrip,
  editExpenseForTrip,
  getTripData,
  updateTrip,
  uploadFile,
  type AddExpenseForTripBody,
  type City,
  type Country,
  type CreateTripPayload,
  type Currency,
  type ExpenseCategory,
  type Trip,
  type TripExpense,
} from "@/api";
import { getTripFromLocalStorage } from "@/utils/localstorage";
import { isNetworkError } from "@/utils/network";
import { acceptHMRUpdate, defineStore } from "pinia";

const useTripDataStore = defineStore("tripData", {
  state: (): TripDataState => ({
    trip: {
      id: 0,
      name: "",
      startDate: "",
      endDate: "",
      status: "deleted",
      image: "",
      totalLocalAmount: 0,
      totalExpenseAmount: 0,
    },
    expenses: [],
    countries: [],
    cities: [],
    currencies: [],
    categories: [],
    users: {},
    isLoading: false,
    hasFailedToLoad: false,
  }),
  actions: {
    restoreStateFromLocalStorage(tripId: number) {
      const retrievedState = getTripFromLocalStorage(tripId);

      if (retrievedState) {
        this.$patch(retrievedState);
      } else {
        throw new Error("failed to retrieve from local storage");
      }
    },

    // syncd to localStorage by name. If name change, update sync
    async loadTripData(tripId: number) {
      try {
        this.resetState();
        this.isLoading = true;
        this.hasFailedToLoad = false;
        const data = await getTripData(tripId);
        this.trip = data.trip;
        this.expenses = data.expenses;
        this.countries = data.countries;
        this.cities = data.cities;
        this.currencies = data.currencies;
        this.categories = data.categories;
        this.users = data.users;
      } catch (err: any) {
        if (isNetworkError(err)) {
          try {
            this.restoreStateFromLocalStorage(tripId);
          } catch (_) {
            this.hasFailedToLoad = true;
          }
        } else {
          this.hasFailedToLoad = true;
        }

        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateTrip({
      tripId,
      payload,
      file,
    }: {
      tripId: number;
      payload: CreateTripPayload;
      file?: Nullable<File>;
    }) {
      try {
        if (file) {
          const fileUrl = await uploadFile(file);
          payload.file = fileUrl;
        }
      } catch (err) {
        throw new Error("Failed to save file");
      }

      await updateTrip(tripId, payload);
      return this.loadTripData(tripId);
    },

    async addExpense({ payload }: { payload: AddExpenseForTripBody }) {
      await addExpenseToTrip(this.trip.id, payload);
      return this.loadTripData(this.trip.id);
    },

    async updateExpense({
      expenseId,
      payload,
    }: {
      expenseId: number;
      payload: AddExpenseForTripBody;
    }) {
      await editExpenseForTrip(this.trip.id, expenseId, payload);
      return this.loadTripData(this.trip.id);
    },

    // syncd to localStorage by name. If name change, update sync
    deleteExpense(expenseId: number) {
      const expenseIdx = this.expenses.findIndex((e) => e.id === expenseId);

      if (expenseIdx > -1) {
        this.expenses.splice(expenseIdx, 1);
      } else {
        throw new Error("Could not find expense to delete");
      }
    },

    resetState() {
      this.trip = {
        id: 0,
        name: "",
        startDate: "",
        endDate: "",
        status: "deleted",
        image: "",
        totalLocalAmount: 0,
        totalExpenseAmount: 0,
      };

      this.expenses = [];
      this.countries = [];
      this.cities = [];
      this.currencies = [];
      this.categories = [];
      this.users = {};
      this.isLoading = false;
      this.hasFailedToLoad = false;
    },
  },
  persist: false, // We need manual persistance due to saving different trips
});

export default useTripDataStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTripDataStore, import.meta.hot));
}

export interface TripDataState {
  trip: Trip;
  expenses: TripExpense[];
  countries: Country[];
  cities: City[];
  currencies: Currency[];
  categories: ExpenseCategory[];
  users: Record<string, { firstName: string; lastName: string }>;
  isLoading: boolean;
  hasFailedToLoad: boolean;
}
