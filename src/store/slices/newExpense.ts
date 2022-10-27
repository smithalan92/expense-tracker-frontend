import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as api from "@/api";
import { NewExpenseState } from "./newExpense.types";
import {
  AddExpenseForTripBody,
  ExpenseCategory,
  GetCitiesForCountryIdsResponse,
  GetCountriesForTripResponse,
} from "@/api.types";
import { formatDateForStoring } from "@/utils/date";
import { RootState, store } from "..";
import {
  addUnsavedExpense,
  loadExpensesForTrip,
  selectExpenseTrip,
  setShouldShowAddExpenseModal,
} from "./expenses";
import {
  getCountriesCitiesKey,
  getStorageItem,
  getTripCountriesKey,
  LOCALSTORAGE_EXPENSE_CATEGORIES_KEY,
  setStorageItem,
} from "@/utils/localStorage";
import axios from "axios";
import { ParsedTripExpense } from "./expenses.types";

const initialState: NewExpenseState = {
  selectedCountryId: null,
  countries: [],
  isLoadingCountries: false,
  hasLoadedCountries: false,
  hasLoadingCountriesFailed: false,
  selectedCityId: null,
  cities: {},
  isLoadingCities: false,
  hasLoadingCitiesFailed: false,
  selectedCurrencyId: null,
  expenseCategories: [],
  selectedCategoryId: null,
  isLoadingExpenseCategories: false,
  hasLoadingExpenseCategoriesFailed: false,
  expenseAmount: 0,
  expenseDescription: "",
  expenseDate: formatDateForStoring(new Date()),
  isSavingExpense: false,
};

export const addExpense = createAsyncThunk<void, void, { state: RootState }>(
  "expenses/addExpense",
  async (_, thunkApi) => {
    const state = thunkApi.getState();
    const { id: tripId } = selectExpenseTrip(state)!;

    const localDateTime = selectExpenseDate(state)!;
    const cityId = selectSelectedCityId(state)!;
    const amount = selectExpenseAmount(state)!;
    const currencyId = selectSelectedCurrencyId(state)!;
    const categoryId = selectSelectedCategoryId(state)!;
    const description = selectExpenseDescription(state)!;

    const payload: AddExpenseForTripBody = {
      localDateTime,
      cityId,
      amount,
      currencyId,
      categoryId,
      description,
    };

    try {
      await api.addExpenseToTrip(tripId, payload);
      await thunkApi.dispatch(loadExpensesForTrip(tripId));
    } catch (err) {
      console.log(err);

      const currency = state.app.currencies.find((c) => c.id == currencyId)!;
      const category = state.newExpense.expenseCategories.find(
        (c) => c.id == categoryId
      )!;
      const city = state.newExpense.cities[
        state.newExpense.selectedCountryId!
      ].find((c) => c.id === cityId)!;

      const tempExpense: ParsedTripExpense = {
        id: Math.random() * -1,
        amount: `${amount}`,
        currency,
        euroAmount: `${amount} ${currency.code}`,
        localDateTime,
        description,
        category,
        city: {
          ...city,
          timezone: "",
        },
        country: {
          id: 0,
          name: "",
        },
        user: {
          id: 0,
          firstName: "",
        },
        createdAt: "",
        updatedAt: "",
        isSaved: false,
      };

      thunkApi.dispatch(addUnsavedExpense(tempExpense));
    }

    thunkApi.dispatch(setShouldShowAddExpenseModal(false));
  }
);

export const loadCountriesForTrip = createAsyncThunk(
  "newExpense/loadCountriesForTrip",
  async (tripId: number) => {
    try {
      const result = await api.getCountriesForTrip(tripId);
      setStorageItem(getTripCountriesKey(tripId), result);
      return result;
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
        const savedResult = getStorageItem<GetCountriesForTripResponse>(
          getTripCountriesKey(tripId)
        );
        if (savedResult) return savedResult;
      }
      throw err;
    }
  }
);

export const loadCitiesForCountryIds = createAsyncThunk<
  GetCitiesForCountryIdsResponse,
  void,
  { state: RootState }
>("newExpense/loadCitiesForCountry", async (_, thunkApi) => {
  const countries = selectCountries(thunkApi.getState());
  const countryIds = countries.map((c) => c.id);

  try {
    const result = await api.getCitiesForCountries(countryIds);
    setStorageItem(getCountriesCitiesKey(countryIds), result);
    return result;
  } catch (err) {
    if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
      const savedResult = getStorageItem<GetCitiesForCountryIdsResponse>(
        getCountriesCitiesKey(countryIds)
      );
      if (savedResult) return savedResult;
    }
    throw err;
  }
});

export const loadExpenseCategories = createAsyncThunk(
  "newExpense/loadExpenseCategories",
  async () => {
    try {
      const result = await api.getExpenseCategories();
      setStorageItem(LOCALSTORAGE_EXPENSE_CATEGORIES_KEY, result);
      return result;
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
        const savedResult = getStorageItem<ExpenseCategory[]>(
          LOCALSTORAGE_EXPENSE_CATEGORIES_KEY
        );
        if (savedResult) return savedResult;
      }
      throw err;
    }
  }
);

export const newExpenseSlice = createSlice({
  name: "newExpense",
  initialState,
  reducers: {
    resetState: (state) => {
      state.selectedCountryId = null;
      state.countries = [];
      state.isLoadingCountries = false;
      state.hasLoadingCountriesFailed = false;
      state.selectedCityId = null;
      state.cities = {};
      state.isLoadingCities = false;
      state.hasLoadingCitiesFailed = false;
      state.selectedCurrencyId = null;
      state.expenseCategories = [];
      state.selectedCategoryId = null;
      state.isLoadingExpenseCategories = false;
      state.hasLoadingExpenseCategoriesFailed = false;
      state.expenseAmount = 0;
      state.expenseDescription = "";
      state.expenseDate = formatDateForStoring(new Date());
      state.isSavingExpense = false;
    },
    setSelectedCountryId: (state, action: PayloadAction<number>) => {
      state.selectedCountryId = action.payload;
      state.selectedCityId = null;
    },
    setSelectedCityId: (state, action: PayloadAction<number>) => {
      state.selectedCityId = action.payload;
    },
    setSelectedCurrencyId: (state, action: PayloadAction<number>) => {
      state.selectedCurrencyId = action.payload;
    },
    setSelectedCategoryId: (state, action: PayloadAction<number>) => {
      state.selectedCategoryId = action.payload;
    },
    setExpenseAmount: (state, action: PayloadAction<number>) => {
      state.expenseAmount = action.payload;
    },
    setExpenseDescription: (state, action: PayloadAction<string>) => {
      state.expenseDescription = action.payload;
    },
    setExpenseDate: (state, action: PayloadAction<string>) => {
      state.expenseDate = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(loadCountriesForTrip.pending, (state) => {
      state.isLoadingCountries = true;
      state.hasLoadingCountriesFailed = false;
      state.hasLoadedCountries = false;
    });

    builder.addCase(
      loadCountriesForTrip.fulfilled,
      (state, action: PayloadAction<GetCountriesForTripResponse>) => {
        state.countries = action.payload.countries;
        state.isLoadingCountries = false;
        state.hasLoadedCountries = true;
      }
    );

    builder.addCase(loadCountriesForTrip.rejected, (state) => {
      state.isLoadingCountries = false;
      state.hasLoadingCountriesFailed = true;
    });

    builder.addCase(loadCitiesForCountryIds.pending, (state) => {
      state.isLoadingCities = true;
      state.hasLoadingCitiesFailed = false;
    });

    builder.addCase(
      loadCitiesForCountryIds.fulfilled,
      (state, action: PayloadAction<GetCitiesForCountryIdsResponse>) => {
        state.cities = { ...action.payload.countries };
        state.isLoadingCities = false;
      }
    );

    builder.addCase(loadCitiesForCountryIds.rejected, (state) => {
      state.isLoadingCities = false;
      state.hasLoadingCitiesFailed = true;
    });

    builder.addCase(loadExpenseCategories.pending, (state) => {
      state.isLoadingExpenseCategories = true;
      state.hasLoadingCitiesFailed = false;
    });

    builder.addCase(loadExpenseCategories.fulfilled, (state, action) => {
      state.expenseCategories = action.payload;
      state.isLoadingExpenseCategories = false;
    });

    builder.addCase(loadExpenseCategories.rejected, (state) => {
      state.hasLoadingExpenseCategoriesFailed = true;
      state.isLoadingExpenseCategories = false;
    });

    builder.addCase(addExpense.pending, (state) => {
      state.isSavingExpense = true;
    });

    builder.addCase(addExpense.fulfilled, (state) => {
      state.isSavingExpense = false;
    });

    builder.addCase(addExpense.rejected, () => {
      // TODO
    });
  },
});

export const {
  resetState,
  setSelectedCountryId,
  setSelectedCityId,
  setSelectedCurrencyId,
  setSelectedCategoryId,
  setExpenseAmount,
  setExpenseDescription,
  setExpenseDate,
} = newExpenseSlice.actions;

const selectState = ({ newExpense }: { newExpense: NewExpenseState }) =>
  newExpense;

export const selectSelectedCountryId = createSelector(
  [selectState],
  (state) => state.selectedCountryId
);

export const selectIsLoadingCountries = createSelector(
  [selectState],
  (state) => state.isLoadingCountries
);

export const selectHasLoadedCountries = createSelector(
  [selectState],
  (state) => state.hasLoadedCountries
);

export const selectHasLoadingCountriesFailed = createSelector(
  [selectState],
  (state) => state.hasLoadingCountriesFailed
);

export const selectCountries = createSelector(
  [selectState],
  (state) => state.countries
);

export const selectSelectedCountry = createSelector([selectState], (state) =>
  state.countries.find((c) => c.id === state.selectedCountryId)
);

export const selectSelectedCityId = createSelector(
  [selectState],
  (state) => state.selectedCityId
);

export const selectIsLoadingCities = createSelector(
  [selectState],
  (state) => state.isLoadingCities
);

export const selectHasLoadingCitiesFailed = createSelector(
  [selectState],
  (state) => state.hasLoadingCitiesFailed
);

export const selectCities = createSelector(
  [selectState],
  (state) => state.cities
);

export const selectSelectedCurrencyId = createSelector(
  [selectState],
  (state) => state.selectedCurrencyId
);

export const selectExpenseCategories = createSelector(
  [selectState],
  (state) => state.expenseCategories
);

export const selectSelectedCategoryId = createSelector(
  [selectState],
  (state) => state.selectedCategoryId
);

export const selectExpenseAmount = createSelector(
  [selectState],
  (state) => state.expenseAmount
);

export const selectExpenseDescription = createSelector(
  [selectState],
  (state) => state.expenseDescription
);

export const selectExpenseDate = createSelector(
  [selectState],
  (state) => state.expenseDate
);

export const selectCanSaveExpense = createSelector([selectState], (state) => {
  return (
    state.selectedCountryId &&
    state.selectedCityId &&
    state.expenseAmount > 0 &&
    state.selectedCurrencyId &&
    state.selectedCategoryId
  );
});

export const selectIsSavingExpense = createSelector(
  [selectState],
  (state) => state.isSavingExpense
);

export default newExpenseSlice.reducer;
