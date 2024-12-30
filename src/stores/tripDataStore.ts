import {
  addExpensesToTrip,
  deleteExpense,
  updateExpense,
  type ExpenseCategory,
  type ExpensePayload,
  type TripExpense,
} from "@/api/expense";
import { uploadFile } from "@/api/file";
import {
  getTripData,
  updateTrip,
  type City,
  type Country,
  type CreateTripPayload,
  type Currency,
  type Trip,
} from "@/api/trip";

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
      image: "",
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
    totalExpenseAmount: (state) => {
      const total = state.expenses.reduce((acc, exp) => {
        return acc + parseFloat(exp.euroAmount);
      }, 0);

      return Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
      }).format(total);
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

    async addExpense({ payload }: { payload: ExpensePayload }) {
      try {
        const result = await addExpensesToTrip(this.trip.id, [payload]);

        this.$patch({
          expenses: [...this.expenses, ...result.data.expenses],
          unsavedExpenses: [],
        });
      } catch (err: any) {
        if (isNetworkError(err)) {
          this.addUnsavedExpense({ payload });
        } else {
          throw err;
        }
      }
    },

    async syncUnsavedExpenses() {
      const expenses = this.unsavedExpenses.reduce<ExpensePayload[]>((acc, exp) => {
        const expense: ExpensePayload = {
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

    addUnsavedExpense({ payload }: { payload: ExpensePayload }) {
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

    async updateExpense({ expenseId, payload }: { expenseId: number; payload: ExpensePayload }) {
      if (expenseId > 0) {
        const existingExpense = this.expenses.find((e) => e.id === expenseId);

        if (!existingExpense) throw new Error("Could not find expense");

        const { expense } = await updateExpense(expenseId, payload);

        existingExpense.id = expense.id;
        existingExpense.amount = expense.amount;
        existingExpense.currency = expense.currency;
        existingExpense.euroAmount = expense.euroAmount;
        existingExpense.localDateTime = expense.localDateTime;
        existingExpense.description = expense.description;
        existingExpense.category = expense.category;
        existingExpense.city = expense.city;
        existingExpense.country = expense.country;
        existingExpense.user = expense.user;
        existingExpense.createdAt = expense.createdAt;
        existingExpense.updatedAt = expense.updatedAt;
      } else {
        this.updateUnsavedExpense({ expenseId, payload });
      }
    },

    async updateUnsavedExpense({ expenseId, payload }: { expenseId: number; payload: ExpensePayload }) {
      const expense = this.unsavedExpenses.find((e) => e.id === expenseId);

      if (!expense) throw new Error("Could not find matching unsaved expense");

      const currency = this.currencies.find((c) => c.id === payload.currencyId);
      const category = this.categories.find((c) => c.id === payload.categoryId);
      const city = this.cities.find((c) => c.id === payload.cityId);
      const country = this.countries.find((c) => c.id === city?.countryId);
      const user = this.users[payload.userId];

      if (!currency || !category || !city || !country || !user) {
        throw new Error("Incomplete data to add unsaved expense");
      }

      expense.amount = payload.amount.toFixed(2);
      expense.euroAmount = `${payload.amount} ${currency.code}`;
      expense.id = expenseId;
      expense.amount = payload.amount.toFixed(2);
      expense.currency = currency;
      expense.euroAmount = `${payload.amount} ${currency.code}`;
      expense.localDateTime = payload.localDateTime;
      expense.description = payload.description;
      expense.category = category;
      expense.city = {
        ...city,
        timezone: "",
      };
      expense.country = country;
      expense.user = {
        id: payload.userId,
        ...user,
      };
      expense.updatedAt = new Date().toISOString();
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
        await deleteExpense(expenseId);
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
