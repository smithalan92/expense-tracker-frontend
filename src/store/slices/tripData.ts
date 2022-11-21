import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as api from "@/api";
import {
  AddExpenseParams,
  DeleteExpenseFufilledActionParams,
  ParsedTripExpense,
} from "./tripData.types";
import {
  AddExpenseForTripBody,
  GetExpensesForTripResponse,
  GetTripDataResponse,
  TripExpense,
} from "@/api.types";
import {
  getStorageItem,
  getTripDataKey,
  getUnsavedExpensesForTripKey,
  setStorageItem,
} from "@/utils/localStorage";
import axios from "axios";
import { RootState } from "..";
import { TripDataState } from "./tripData.types";
import { getTempExpense } from "@/utils/expense";

const initialState: TripDataState = {
  trip: {},
  expenses: [],
  countries: [],
  cities: [],
  currencies: [],
  categories: [],
  isLoadingTripData: false,
  hasLoadedTripData: false,
  hasFailedToTripData: false,
  isAddingExpense: false,
  unsavedExpenses: [],
  isSyncingUnSavedExpenses: false,
  isLoadingExpenses: false,
  shouldShowAddExpenseModal: false,
  shouldShowTripStatsModal: false,
  isDeletingExpense: false,
  didDeleteExpense: false,
  didDeletingExpenseFail: false,
};

export const loadTripData = createAsyncThunk(
  "tripData/loadTripData",
  async (tripId: number, thunkApi) => {
    try {
      const result = await api.getTripData(tripId);
      setStorageItem(getTripDataKey(tripId), result);
      thunkApi.dispatch(loadUnsavedExpensesFromStorage(tripId));
      return result;
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
        const savedResponse = getStorageItem<GetTripDataResponse>(
          getTripDataKey(tripId)
        );

        if (savedResponse) return savedResponse;
      }

      throw err;
    }
  }
);

export const addExpense = createAsyncThunk<
  void,
  AddExpenseParams,
  { state: RootState }
>("tripData/addExpense", async (params, thunkApi) => {
  const state = thunkApi.getState();
  const { id: tripId } = selectTrip(state)!;

  const payload: AddExpenseForTripBody = {
    localDateTime: params.date,
    cityId: params.cityId,
    amount: params.amount,
    currencyId: params.currencyId,
    categoryId: params.categoryId,
    description: params.description,
  };

  try {
    await api.addExpenseToTrip(tripId, payload);
    await thunkApi.dispatch(loadTripData(tripId));
  } catch (err) {
    console.log(err);
    const tempExpense = getTempExpense(state.tripData, params);

    thunkApi.dispatch(addUnsavedExpense(tempExpense));
  }

  thunkApi.dispatch(setShouldShowAddExpenseModal(false));
});

export const loadExpenses = createAsyncThunk<
  GetExpensesForTripResponse | null,
  void,
  { state: RootState }
>("tripData/loadExpenses", async (__, thunkApi) => {
  const state = thunkApi.getState();
  const { id: tripId } = selectTrip(state)!;

  try {
    const data = await api.getExpensesForTrip(tripId);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
});

export const syncUnsavedExpenses = createAsyncThunk<
  number[],
  void,
  { state: RootState }
>("tripData/syncUnsavedExpenses", async (_, thunkApi) => {
  const state = thunkApi.getState();
  const { trip, unsavedExpenses } = state.tripData;

  const savedExpenses = [];

  for await (const expense of unsavedExpenses) {
    try {
      const payload: AddExpenseForTripBody = {
        localDateTime: expense.localDateTime,
        cityId: expense.city.id,
        amount: parseFloat(expense.amount),
        currencyId: expense.currency.id,
        categoryId: expense.category.id,
        description: expense.description,
      };
      await api.addExpenseToTrip(trip!.id, payload);
      savedExpenses.push(expense.id);
    } catch (err) {
      console.log(err);
    }
  }

  if (savedExpenses.length) {
    await thunkApi.dispatch(loadExpenses());
  }

  return savedExpenses;
});

export const deleteExpense = createAsyncThunk<
  DeleteExpenseFufilledActionParams,
  number,
  { state: RootState }
>("tripData/deleteExpense", async (expenseId, thunkApi) => {
  const state = thunkApi.getState();
  const tripId = state.tripData.trip.id;

  const tempExp = state.tripData.unsavedExpenses.find(
    (e) => e.id === expenseId
  );

  // No api call if its local;
  if (tempExp) {
    return { tripId, expenseId };
  }

  await api.deleteExpense(tripId, expenseId);

  return { tripId, expenseId };
});

export const expenseSlice = createSlice({
  name: "tripData",
  initialState,
  reducers: {
    resetState: (state) => {
      state.trip = {};
      state.expenses = [];
      state.countries = [];
      state.cities = [];
      state.currencies = [];
      state.categories = [];
      state.isLoadingTripData = false;
      state.hasLoadedTripData = false;
      state.hasFailedToTripData = false;
      state.isAddingExpense = false;
      state.unsavedExpenses = [];
      state.isSyncingUnSavedExpenses = false;
      state.shouldShowAddExpenseModal = false;
      state.shouldShowTripStatsModal = false;
      state.isDeletingExpense = false;
      state.didDeleteExpense = false;
      state.didDeletingExpenseFail = false;
    },
    loadUnsavedExpensesFromStorage: (state, action: PayloadAction<number>) => {
      const unsavedExpenses = getStorageItem<ParsedTripExpense[]>(
        getUnsavedExpensesForTripKey(action.payload)
      );

      if (unsavedExpenses) {
        state.unsavedExpenses = unsavedExpenses;
      }
    },
    setShouldShowAddExpenseModal(state, action: PayloadAction<boolean>) {
      state.shouldShowAddExpenseModal = action.payload;
    },
    setShouldShowTripStatsModal(state, action: PayloadAction<boolean>) {
      state.shouldShowTripStatsModal = action.payload;
    },
    addUnsavedExpense(state, action: PayloadAction<ParsedTripExpense>) {
      state.unsavedExpenses.push(action.payload);
      setStorageItem(
        getUnsavedExpensesForTripKey(state.trip.id),
        state.unsavedExpenses
      );
    },
    resetDeleteStates(state) {
      state.isDeletingExpense = false;
      state.didDeleteExpense = false;
      state.didDeletingExpenseFail = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(loadTripData.pending, (state) => {
      state.isLoadingTripData = true;
      state.hasLoadedTripData = false;
      state.hasFailedToTripData = false;
    });
    builder.addCase(
      loadTripData.fulfilled,
      (state, action: PayloadAction<GetTripDataResponse>) => {
        state.trip = action.payload.trip;
        state.expenses = action.payload.expenses.map((exp) => {
          return {
            ...exp,
            isSaved: true,
          };
        });
        state.countries = action.payload.countries;
        state.cities = action.payload.cities;
        state.currencies = action.payload.currencies;
        state.categories = action.payload.categories;
        state.isLoadingTripData = false;
      }
    );
    builder.addCase(loadTripData.rejected, (state) => {
      state.hasFailedToTripData = true;
      state.isLoadingTripData = false;
    });

    builder.addCase(addExpense.pending, (state) => {
      state.isAddingExpense = true;
    });

    builder.addCase(addExpense.fulfilled, (state) => {
      state.isAddingExpense = false;
    });

    builder.addCase(syncUnsavedExpenses.pending, (state) => {
      state.isSyncingUnSavedExpenses = true;
    });

    builder.addCase(
      syncUnsavedExpenses.fulfilled,
      (state, action: PayloadAction<number[]>) => {
        state.unsavedExpenses = state.unsavedExpenses.filter(({ id }) => {
          return !action.payload.includes(id);
        });
        state.isSyncingUnSavedExpenses = false;
        setStorageItem(
          getUnsavedExpensesForTripKey(state.trip!.id),
          state.unsavedExpenses
        );
      }
    );

    builder.addCase(loadExpenses.pending, (state) => {
      state.isLoadingExpenses = true;
    });

    builder.addCase(loadExpenses.fulfilled, (state, action) => {
      if (action.payload) {
        state.expenses = action.payload.expenses.map((exp) => {
          return {
            ...exp,
            isSaved: true,
          };
        });
      }
      state.isLoadingExpenses = false;
    });

    builder.addCase(deleteExpense.pending, (state) => {
      state.isDeletingExpense = true;
    });

    builder.addCase(
      deleteExpense.fulfilled,
      (state, action: PayloadAction<DeleteExpenseFufilledActionParams>) => {
        const { tripId, expenseId } = action.payload;
        state.expenses = state.expenses.filter((e) => e.id !== expenseId);
        state.unsavedExpenses = state.unsavedExpenses.filter(
          (e) => e.id !== expenseId
        );
        setStorageItem(
          getUnsavedExpensesForTripKey(tripId),
          state.unsavedExpenses
        );
        state.didDeleteExpense = true;
        state.isDeletingExpense = false;
      }
    );

    builder.addCase(deleteExpense.rejected, (state) => {
      state.didDeletingExpenseFail = true;
      state.isDeletingExpense = false;
    });
  },
});

export const {
  resetState,
  setShouldShowAddExpenseModal,
  addUnsavedExpense,
  loadUnsavedExpensesFromStorage,
  setShouldShowTripStatsModal,
  resetDeleteStates,
} = expenseSlice.actions;

const selectState = ({ tripData }: { tripData: TripDataState }) => tripData;

export const selectCountries = createSelector(
  [selectState],
  (state) => state.countries
);

export const selectExpenses = createSelector([selectState], (state) => {
  const exp = [...state.expenses, ...state.unsavedExpenses];

  return exp.sort((a, b) => {
    return (
      new Date(b.localDateTime).getTime() - new Date(a.localDateTime).getTime()
    );
  });
});

export const selectIsLoadingTripData = createSelector(
  [selectState],
  (state) => state.isLoadingTripData
);

export const selectHasLoadedTripData = createSelector(
  [selectState],
  (state) => state.hasLoadedTripData
);

export const selectHasFailedToTripData = createSelector(
  [selectState],
  (state) => state.hasFailedToTripData
);

export const selectTrip = createSelector([selectState], (state) => state.trip);

export const selectShouldShowAddExpenseModal = createSelector(
  [selectState],
  (state) => state.shouldShowAddExpenseModal
);

export const selectCanShowSyncButton = createSelector(
  [selectState],
  (state) => state.unsavedExpenses.length > 0
);

export const selectCountryById = createSelector(
  [selectState, (state, countryId: number) => countryId],
  (state, countryId) => {
    return state.countries.find((c) => c.id === countryId);
  }
);

export const selectCitiesForCountryId = createSelector(
  [selectState, (state, countryId: number | null) => countryId],
  (state, countryId) => {
    return state.cities.filter((c) => c.countryId === countryId);
  }
);

export const selectExpenseById = createSelector(
  [selectState, (state, expenseId: number) => expenseId],
  (state, expenseId) => {
    const expense = state.expenses.find((e) => e.id === expenseId);
    if (expense) return expense;

    return state.unsavedExpenses.find((e) => e.id === expenseId);
  }
);

export const selectCurrencies = createSelector(
  [selectState],
  (state) => state.currencies
);

export const selectCategories = createSelector(
  [selectState],
  (state) => state.categories
);

export const selectIsAddingExpense = createSelector(
  [selectState],
  (state) => state.isAddingExpense
);

export const selectIsSyncingUnSavedExpenses = createSelector(
  [selectState],
  (state) => state.isSyncingUnSavedExpenses
);

export const selectIsLoadingExpenses = createSelector(
  [selectState],
  (state) => state.isLoadingExpenses
);

export const selectShouldShowTripStatsModal = createSelector(
  [selectState],
  (state) => state.shouldShowTripStatsModal
);

export const selectIsDeletingExpense = createSelector(
  [selectState],
  (state) => state.isDeletingExpense
);

export const selectDidDeletingExpense = createSelector(
  [selectState],
  (state) => state.didDeleteExpense
);

export const selectDidDeletingExpenseFail = createSelector(
  [selectState],
  (state) => state.didDeletingExpenseFail
);

export default expenseSlice.reducer;
