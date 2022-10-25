import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as api from "@/api";
import { ExpenseState } from "./expenses.types";
import { GetExpensesForTripResponse } from "@/api.types";
import {
  getStorageItem,
  getTripExpensesKey,
  setStorageItem,
} from "@/utils/localStorage";
import axios from "axios";

const initialState: ExpenseState = {
  trip: null,
  expenses: null,
  isLoadingExpenses: false,
  hasLoadedExpenses: false,
  hasFailedToLoadExpenses: false,
  shouldShowAddExpenseModal: false,
};

export const loadExpensesForTrip = createAsyncThunk(
  "expenses/loadExpensesForTrip",
  async (tripId: number) => {
    try {
      const result = await api.getExpensesForTrip(tripId);
      setStorageItem(getTripExpensesKey(tripId), result);
      return result;
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
        const savedResponse = getStorageItem<GetExpensesForTripResponse>(
          getTripExpensesKey(1)
        );

        if (savedResponse) return savedResponse;
      }

      throw err;
    }
  }
);

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
    setShouldShowAddExpenseModal(state, action: PayloadAction<boolean>) {
      state.shouldShowAddExpenseModal = action.payload;
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
        state.expenses = action.payload.expenses;
        state.trip = action.payload.trip;
        state.isLoadingExpenses = false;
        state.hasLoadedExpenses = true;
      }
    );
    builder.addCase(loadExpensesForTrip.rejected, (state) => {
      state.hasFailedToLoadExpenses = true;
      state.isLoadingExpenses = false;
    });
  },
});

export const { resetState, setShouldShowAddExpenseModal } =
  expenseSlice.actions;

const selectExpenseState = ({ expenses }: { expenses: ExpenseState }) =>
  expenses;

export const selectExpenses = createSelector(
  [selectExpenseState],
  (expenseState) => expenseState.expenses
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

export default expenseSlice.reducer;
