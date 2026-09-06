import {
  addExpensesToTrip,
  deleteExpense,
  updateExpense,
  type ExpenseCategory,
  type ExpensePayload,
  type TripExpense,
} from "@/api/expense";
import { getTripData, updateTrip, type CreateTripPayload, type Trip, type TripCountry } from "@/api/trip";

import { FileUploadError, uploadFile } from "@/api/file";
import useAppStore from "@/store/appStore";
import useTripsStore from "@/store/tripsStore";
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
    filters: {
      search: "",
      filterByUserId: null,
      filterByCategoryId: null,
    },
  }),
  getters: {
    getExpenses(state) {
      return [...state.expenses, ...state.unsavedExpenses].filter((exp) => {
        const { search, filterByUserId, filterByCategoryId } = state.filters;
        const hasMatchingDescription = search.trim() ? exp.description.includes(search.trim()) : true;

        const hasMatchingUser = filterByUserId
          ? exp.users.find((user) => user.id === filterByUserId) !== undefined
          : true;

        const hasMatchingCategory = filterByCategoryId ? exp.category.id === filterByCategoryId : true;

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
        // Keep the reason when the API gave us one, so it can be shown to the user
        if (err instanceof FileUploadError) throw err;
        throw new Error("Failed to save file");
      }

      const { trip, userIds, currencyIds, countries } = await updateTrip(tripId, payload);

      this.$patch({
        trip,
        currencyIds,
        userIds,
        countries,
      });

      const tripStore = useTripsStore();

      const currentTrips: Trip[] = JSON.parse(JSON.stringify(tripStore.trips));
      const tripIdx = currentTrips.findIndex((t: Trip) => t.id === trip.id);

      if (tripIdx > -1) {
        currentTrips[tripIdx] = trip;
      }

      tripStore.$patch({
        trips: currentTrips,
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
        this.expenses.splice(expenseIdx, 1);
      } else {
        throw new Error("Could not find expense to delete");
      }
    },

    resetState() {
      this.$reset();
    },

    clearFilters() {
      this.filters = {
        search: "",
        filterByCategoryId: null,
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
  filters: {
    search: string;
    filterByUserId: number | null;
    filterByCategoryId: number | null;
  };
}
