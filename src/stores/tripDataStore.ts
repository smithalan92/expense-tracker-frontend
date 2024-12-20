import {
  addExpensesToTrip,
  addExpenseToTrip,
  deleteExpense,
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
  type NewExpenseData,
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
    unsavedExpenses: [],
    countries: [],
    cities: [],
    currencies: [],
    categories: [],
    users: {},
    isLoadingTripData: false,
    hasFailedToLoadTripData: false,
  }),
  getters: {
    hasUnsavedExpenses: (state) => {
      return state.unsavedExpenses.length > 0;
    },
  },
  actions: {
    restoreStateFromLocalStorage(tripId: number) {
      const retrievedState = getTripFromLocalStorage(tripId);

      if (retrievedState) {
        this.$patch(retrievedState);
      } else {
        throw new Error("failed to retrieve from local storage");
      }
    },

    restoreUnsavedExpensesFromLocalStorage(tripId: number) {
      const retrievedState = getTripFromLocalStorage(tripId);

      if (retrievedState?.unsavedExpenses.length) {
        this.$patch({ unsavedExpenses: retrievedState.unsavedExpenses });
      }
    },

    // syncd to localStorage by name. If name change, update sync
    async loadTripData(tripId: number) {
      try {
        this.resetState();
        this.isLoadingTripData = true;
        this.hasFailedToLoadTripData = false;
        const data = await getTripData(tripId);
        this.trip = data.trip;
        this.expenses = data.expenses;
        this.countries = data.countries;
        this.cities = data.cities;
        this.currencies = data.currencies;
        this.categories = data.categories;
        this.users = data.users;

        this.restoreUnsavedExpensesFromLocalStorage(tripId);
      } catch (err: any) {
        if (isNetworkError(err)) {
          try {
            this.restoreStateFromLocalStorage(tripId);
          } catch {
            this.hasFailedToLoadTripData = true;
          }
        } else {
          this.hasFailedToLoadTripData = true;
        }

        throw err;
      } finally {
        this.isLoadingTripData = false;
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
      } catch {
        throw new Error("Failed to save file");
      }

      await updateTrip(tripId, payload);
      return this.loadTripData(tripId);
    },

    async addExpense({ payload }: { payload: AddExpenseForTripBody }) {
      try {
        await addExpenseToTrip(this.trip.id, payload);
        return this.loadTripData(this.trip.id);
      } catch (err: any) {
        if (isNetworkError(err)) {
          this.addUnsavedExpense({ payload });
        } else {
          throw err;
        }
      }
    },

    async syncUnsavedExpenses() {
      const expenses = this.unsavedExpenses.reduce<NewExpenseData[]>((acc, exp) => {
        const expense: NewExpenseData = {
          localDateTime: exp.localDateTime,
          cityId: exp.city.id,
          amount: parseFloat(exp.amount),
          currencyId: exp.currency.id,
          categoryId: exp.category.id,
          description: exp.description,
          userId: exp.user.id,
        };

        acc.push(expense);
        return acc;
      }, []);

      const result = await addExpensesToTrip(this.trip.id, expenses);

      this.$patch({
        expenses: [...this.expenses, ...result.data.expenses],
        unsavedExpenses: [],
      });
    },

    addUnsavedExpense({ payload }: { payload: AddExpenseForTripBody }) {
      const currency = this.currencies.find((c) => c.id === payload.currencyId);
      const category = this.categories.find((c) => c.id === payload.categoryId);
      const city = this.cities.find((c) => c.id === payload.cityId);
      const country = this.countries.find((c) => c.id === city?.countryId);
      const user = this.users[payload.userId];

      if (!currency || !category || !city || !country || !user) {
        throw new Error("Incomplete data to add unsaved expense");
      }

      this.unsavedExpenses.push({
        id: Math.ceil(Math.random() * 10000) * -1,
        amount: payload.amount.toFixed(2),
        currency,
        euroAmount: `${payload.amount} ${currency.code}`,
        localDateTime: payload.localDateTime,
        description: payload.description,
        category,
        city: {
          ...city,
          timezone: "",
        },
        country,
        user: {
          id: payload.userId,
          ...user,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    },

    async updateExpense({ expenseId, payload }: { expenseId: number; payload: AddExpenseForTripBody }) {
      await editExpenseForTrip(this.trip.id, expenseId, payload);
      return this.loadTripData(this.trip.id);
    },

    // syncd to localStorage by name. If name change, update sync
    async deleteExpense(expenseId: number) {
      if (expenseId < 0) {
        const expenseIdx = this.unsavedExpenses.findIndex((e) => e.id === expenseId);
        if (expenseIdx > -1) {
          this.unsavedExpenses.splice(expenseIdx, 1);
        } else {
          throw new Error("Could not find expense to delete");
        }
        return;
      }

      const expenseIdx = this.expenses.findIndex((e) => e.id === expenseId);

      if (expenseIdx > -1) {
        await deleteExpense(this.trip.id, expenseId);
        this.expenses.splice(expenseIdx, 1);
      } else {
        throw new Error("Could not find expense to delete");
      }
    },

    resetState() {
      this.$reset();
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
  unsavedExpenses: TripExpense[];
  countries: Country[];
  cities: City[];
  currencies: Currency[];
  categories: ExpenseCategory[];
  users: Record<string, { firstName: string; lastName: string }>;
  isLoadingTripData: boolean;
  hasFailedToLoadTripData: boolean;
}
