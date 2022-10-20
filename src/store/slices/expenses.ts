import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as api from "@/api";
import { ExpenseState } from "./expenses.types";
import { GetExpensesForTripResponse } from "@/api.types";

const initialState: ExpenseState = {
  trip: null,
  expenses: null,
  isLoadingExpenses: false,
  hasLoadedExpenses: false,
  hasFailedToLoadExpenses: false,
};

export const loadExpensesForTrip = createAsyncThunk(
  "expenses/loadExpensesForTrip",
  (tripId: number) => {
    return api.getExpensesForTrip(tripId);
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

export const { resetState } = expenseSlice.actions;

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

export default expenseSlice.reducer;
