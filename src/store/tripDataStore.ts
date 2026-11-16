import {
  addExpensesToTrip,
  deleteExpense,
  updateExpense,
  type ExpenseCategory,
  type ExpensePayload,
  type TripExpense,
} from "@/api/expense";
import type { TripEvent } from "@/api/events";
import { getTripData, type Trip, type TripCountry } from "@/api/trip";

import useAppStore from "@/store/appStore";
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
      countries: [],
      users: [],
      expenseCount: 0,
    },
    expenses: [],
    unsavedExpenses: [],
    countries: [],
    currencyIds: [],
    categories: [],
    userIds: [],
    isLoadingTripData: false,
    hasFailedToLoadTripData: false,
    deletedExpenseIds: [],
    filters: {
      search: "",
      filterByUserId: null,
      filterByCategoryId: null,
      excludedCategoryIds: [],
    },
  }),
  getters: {
    getExpenses(state) {
      return [...state.expenses, ...state.unsavedExpenses].filter((exp) => {
        const { search, filterByUserId, filterByCategoryId, excludedCategoryIds } = state.filters;
        const hasMatchingDescription = search.trim() ? exp.description.includes(search.trim()) : true;

        const hasMatchingUser = filterByUserId
          ? exp.users.find((user) => user.id === filterByUserId) !== undefined
          : true;

        const hasMatchingCategory =
          (filterByCategoryId ? exp.category.id === filterByCategoryId : true) &&
          !excludedCategoryIds.includes(exp.category.id);

        return hasMatchingDescription && hasMatchingUser && hasMatchingCategory;
      });
    },
    hasUnsavedExpenses(state) {
      return state.unsavedExpenses.length > 0;
    },
    totalExpenseAmount(state): string {
      const total = [...state.expenses, ...state.unsavedExpenses].reduce((acc, exp) => {
        return acc + parseFloat(exp.euroAmount);
      }, 0);

      return Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
      }).format(total);
    },

    areAnyFiltersActive(state) {
      return (
        state.filters.search.trim().length > 0 ||
        !!state.filters.filterByCategoryId ||
        state.filters.excludedCategoryIds.length > 0 ||
        !!state.filters.filterByUserId
      );
    },
  },
  actions: {
    _restoreStateFromLocalStorage(tripId: number) {
      const retrievedState = getTripFromLocalStorage(tripId);

      if (retrievedState) {
        this.$patch(retrievedState);
      } else {
        throw new Error("failed to retrieve from local storage");
      }
    },

    _restoreUnsavedExpensesFromLocalStorage(tripId: number) {
      const retrievedState = getTripFromLocalStorage(tripId);

      if (retrievedState?.unsavedExpenses?.length) {
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
        this.currencyIds = data.currencyIds;
        this.categories = data.categories;
        this.userIds = data.userIds;

        this._restoreUnsavedExpensesFromLocalStorage(tripId);
      } catch (err: any) {
        if (isNetworkError(err)) {
          try {
            this._restoreStateFromLocalStorage(tripId);
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

    // Refreshes trip data in place. Unlike loadTripData this doesn't reset state or
    // toggle isLoadingTripData, so the list stays on screen while we refetch. Unsaved
    // expenses and filters are left alone, and a failure leaves the existing data be.
    async refreshTripData(tripId: number) {
      const data = await getTripData(tripId);

      this.$patch({
        trip: data.trip,
        expenses: data.expenses,
        countries: data.countries,
        currencyIds: data.currencyIds,
        categories: data.categories,
        userIds: data.userIds,
      });
    },

    async addExpense({ payload }: { payload: ExpensePayload }) {
      try {
        const result = await addExpensesToTrip(this.trip.id, [payload]);

        this.$patch({
          expenses: [...this.expenses, ...result.data.expenses],
        });
      } catch (err: any) {
        if (isNetworkError(err)) {
          this._addUnsavedExpense({ payload });
        } else {
          throw err;
        }
      }
    },

    _addUnsavedExpense({ payload }: { payload: ExpensePayload }) {
      const { currencies, users } = useAppStore();
      const currency = currencies.find((c) => c.id === payload.currencyId);
      const category = this.categories.find((c) => c.id === payload.categoryId);
      const country = this.countries.find((c) => c.id === payload.countryId)!;

      const city = country?.cities.find((c) => c.id === payload.cityId);

      const expenseUsers = users.filter((u) => payload.userIds.includes(u.id));

      if (!currency || !category || !city || !country || !expenseUsers.length) {
        const missingType = !currency
          ? "currency"
          : !category
            ? "category"
            : !city
              ? "city"
              : !country
                ? "country"
                : "users";

        throw new Error(`Incomplete data to add unsaved expense - missing ${missingType}`);
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
        users: expenseUsers,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        latlong: payload.latlong,
      });
    },

    async syncUnsavedExpenses() {
      if (!this.hasUnsavedExpenses) return;

      const expenses = this.unsavedExpenses.reduce<ExpensePayload[]>((acc, exp) => {
        const expense: ExpensePayload = {
          localDateTime: exp.localDateTime,
          countryId: exp.country.id,
          cityId: exp.city.id,
          amount: parseFloat(exp.amount),
          currencyId: exp.currency.id,
          categoryId: exp.category.id,
          description: exp.description,
          userIds: exp.users.map((u) => u.id),
          latlong: exp.latlong,
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
        existingExpense.users = expense.users;
        existingExpense.createdAt = expense.createdAt;
        existingExpense.updatedAt = expense.updatedAt;
      } else {
        this._updateUnsavedExpense({ expenseId, payload });
      }
    },

    async _updateUnsavedExpense({ expenseId, payload }: { expenseId: number; payload: ExpensePayload }) {
      const expense = this.unsavedExpenses.find((e) => e.id === expenseId);

      if (!expense) throw new Error("Could not find matching unsaved expense");

      const { currencies, users } = useAppStore();
      const currency = currencies.find((c) => c.id === payload.currencyId);
      const category = this.categories.find((c) => c.id === payload.categoryId);
      const country = this.countries.find((c) => c.id === payload.countryId)!;

      const city = country?.cities.find((c) => c.id === payload.cityId);

      const expenseUsers = users.filter((u) => payload.userIds.includes(u.id));

      if (!currency || !category || !city || !country || !expenseUsers.length) {
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
      expense.users = expenseUsers;
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
        this.deletedExpenseIds.push(expenseId);
        this.expenses.splice(expenseIdx, 1);
      } else {
        throw new Error("Could not find expense to delete");
      }
    },

    // Applies an expense change another trip member made (received over the events stream)
    applyRemoteTripEvent(event: TripEvent) {
      // Number() since the backend has sent tripId as a string ("73") despite its types saying number
      if (!this.trip.id || Number(event.data.tripId) !== this.trip.id) return;

      switch (event.event) {
        case "expense.added": {
          const existingIds = new Set(this.expenses.map((e) => e.id));
          const newExpenses = event.data.expenses.filter(
            (e) => !existingIds.has(e.id) && !this.deletedExpenseIds.includes(e.id),
          );
          if (newExpenses.length) this.expenses.push(...newExpenses);
          break;
        }
        case "expense.updated": {
          const { expense } = event.data;
          if (this.deletedExpenseIds.includes(expense.id)) break;
          const idx = this.expenses.findIndex((e) => e.id === expense.id);
          // Not found means we missed the add, so treat it as one
          if (idx > -1) this.expenses.splice(idx, 1, expense);
          else this.expenses.push(expense);
          break;
        }
        case "expense.deleted": {
          const expenseId = Number(event.data.expenseId);
          this.deletedExpenseIds.push(expenseId);
          const idx = this.expenses.findIndex((e) => e.id === expenseId);
          if (idx > -1) this.expenses.splice(idx, 1);
          break;
        }
      }
    },

    resetState() {
      this.$reset();
    },

    clearFilters() {
      this.filters = {
        search: "",
        filterByCategoryId: null,
        excludedCategoryIds: [],
        filterByUserId: null,
      };
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
  countries: TripCountry[];
  currencyIds: number[];
  categories: ExpenseCategory[];
  userIds: number[];
  isLoadingTripData: boolean;
  hasFailedToLoadTripData: boolean;
  // Ids of expenses deleted locally or via the events stream. Expense ids are never reused, so this
  // lets a stream event that races a delete (e.g. someone's edit landing just after we deleted it)
  // be ignored instead of bringing the expense back. Not persisted.
  deletedExpenseIds: number[];
  filters: {
    search: string;
    filterByUserId: number | null;
    filterByCategoryId: number | null;
    excludedCategoryIds: number[];
  };
}
