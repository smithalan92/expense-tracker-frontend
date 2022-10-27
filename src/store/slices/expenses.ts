import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as api from "@/api";
import { ExpenseState, ParsedTripExpense } from "./expenses.types";
import { AddExpenseForTripBody, GetExpensesForTripResponse } from "@/api.types";
import {
  getStorageItem,
  getTripExpensesKey,
  getUnsavedExpensesForTripKey,
  setStorageItem,
} from "@/utils/localStorage";
import axios from "axios";
import { RootState } from "..";

const initialState: ExpenseState = {
  trip: null,
  expenses: [],
  isLoadingExpenses: false,
  hasLoadedExpenses: false,
  hasFailedToLoadExpenses: false,
  unsavedExpenses: [],
  isSyncingUnSavedExpenses: false,
  shouldShowAddExpenseModal: false,
};

export const loadExpensesForTrip = createAsyncThunk(
  "expenses/loadExpensesForTrip",
  async (tripId: number, thunkApi) => {
    try {
      const result = await api.getExpensesForTrip(tripId);
      setStorageItem(getTripExpensesKey(tripId), result);
      thunkApi.dispatch(loadUnsavedExpensesFromStorage(tripId));
      return result;
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
        const savedResponse = getStorageItem<GetExpensesForTripResponse>(
          getTripExpensesKey(tripId)
        );

        if (savedResponse) return savedResponse;
      }

      throw err;
    }
  }
);

export const syncUnsavedExpenses = createAsyncThunk<
  number[],
  void,
  { state: RootState }
>("expenses/syncUnsavedExpenses", async (_, thunkApi) => {
  const state = thunkApi.getState();
  const { trip, unsavedExpenses } = state.expenses;

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
    await thunkApi.dispatch(loadExpensesForTrip(trip!.id));
  }

  return savedExpenses;
});

export const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    resetState: (state) => {
      state.expenses = [];
      state.isLoadingExpenses = false;
      state.hasLoadedExpenses = false;
      state.hasFailedToLoadExpenses = false;
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
    addUnsavedExpense(state, action: PayloadAction<ParsedTripExpense>) {
      state.unsavedExpenses.push(action.payload);
      setStorageItem(
        getUnsavedExpensesForTripKey(state.trip!.id),
        state.unsavedExpenses
      );
    },
  },
  extraReducers(builder) {
    builder.addCase(loadExpensesForTrip.pending, (state) => {
      state.isLoadingExpenses = true;
      state.hasLoadedExpenses = false;
      state.hasFailedToLoadExpenses = false;
    });
    builder.addCase(
      loadExpensesForTrip.fulfilled,
      (state, action: PayloadAction<GetExpensesForTripResponse>) => {
        state.expenses = action.payload.expenses.map((exp) => {
          return {
            ...exp,
            isSaved: true,
          };
        });
        state.trip = action.payload.trip;
        state.isLoadingExpenses = false;
        state.hasLoadedExpenses = true;
      }
    );
    builder.addCase(loadExpensesForTrip.rejected, (state) => {
      state.hasFailedToLoadExpenses = true;
      state.isLoadingExpenses = false;
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
  },
});

export const {
  resetState,
  setShouldShowAddExpenseModal,
  addUnsavedExpense,
  loadUnsavedExpensesFromStorage,
} = expenseSlice.actions;

const selectExpenseState = ({ expenses }: { expenses: ExpenseState }) =>
  expenses;

export const selectExpenses = createSelector(
  [selectExpenseState],
  (expenseState) => {
    return [...expenseState.expenses, ...expenseState.unsavedExpenses].sort(
      (a, b) => {
        return (
          new Date(b.localDateTime).getTime() -
          new Date(a.localDateTime).getTime()
        );
      }
    );
  }
);

export const selectIsLoadingExpenses = createSelector(
  [selectExpenseState],
  (expenseState) => expenseState.isLoadingExpenses
);

export const selectHasLoadedExpenses = createSelector(
  [selectExpenseState],
  (expenseState) => expenseState.hasLoadedExpenses
);

export const selectHasFailedToLoadExpenses = createSelector(
  [selectExpenseState],
  (expenseState) => expenseState.hasFailedToLoadExpenses
);

export const selectExpenseTrip = createSelector(
  [selectExpenseState],
  (expenseState) => expenseState.trip
);

export const selectShouldShowAddExpenseModal = createSelector(
  [selectExpenseState],
  (expenseState) => expenseState.shouldShowAddExpenseModal
);

export const selectCanShowSyncButton = createSelector(
  [selectExpenseState],
  (expenseState) => expenseState.unsavedExpenses.length > 0
);

export default expenseSlice.reducer;
