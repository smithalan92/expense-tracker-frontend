import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as api from "@/api";
import { NewExpenseState } from "./newExpense.types";
import {
  GetCitiesForCountryResponse,
  GetCountriesForTripResponse,
} from "@/api.types";

const initialState: NewExpenseState = {
  selectedCountryId: null,
  countries: [],
  isLoadingCountries: false,
  hasLoadingCountriesFailed: false,
  selectedCityId: null,
  cities: [],
  isLoadingCities: false,
  hasLoadingCitiesFailed: false,
  selectedCurrencyId: null,
  expenseCategories: [],
  selectedCategoryId: null,
  isLoadingExpenseCategories: false,
  hasLoadingExpenseCategoriesFailed: false,
  expenseAmount: 0,
  expenseDescription: "",
};

export const loadCountriesForTrip = createAsyncThunk(
  "newExpense/loadCountriesForTrip",
  (tripId: number) => {
    return api.getCountriesForTrip(tripId);
  }
);

export const loadCitiesForCountry = createAsyncThunk(
  "newExpense/loadCitiesForCountry",
  (countryId: number) => {
    return api.getCitiesForCountry(countryId);
  }
);

export const loadExpenseCategories = createAsyncThunk(
  "newExpense/loadExpenseCategories",
  () => {
    return api.getExpenseCategories();
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
      state.cities = [];
      state.isLoadingCities = false;
      state.hasLoadingCitiesFailed = false;
      state.selectedCurrencyId = null;
      state.expenseCategories = [];
      state.selectedCategoryId = null;
      state.isLoadingExpenseCategories = false;
      state.hasLoadingExpenseCategoriesFailed = false;
      state.expenseAmount = 0;
      state.expenseDescription = "";
    },
    setSelectedCountryId: (state, action: PayloadAction<number>) => {
      state.selectedCountryId = action.payload;
      state.selectedCityId = null;
      state.cities = [];
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
  },
  extraReducers(builder) {
    builder.addCase(loadCountriesForTrip.pending, (state) => {
      state.isLoadingCountries = true;
      state.hasLoadingCountriesFailed = false;
    });

    builder.addCase(
      loadCountriesForTrip.fulfilled,
      (state, action: PayloadAction<GetCountriesForTripResponse>) => {
        state.countries = action.payload.countries;
        state.isLoadingCountries = false;
      }
    );

    builder.addCase(loadCountriesForTrip.rejected, (state) => {
      state.isLoadingCountries = false;
      state.hasLoadingCountriesFailed = true;
    });

    builder.addCase(loadCitiesForCountry.pending, (state) => {
      state.isLoadingCities = true;
      state.hasLoadingCitiesFailed = false;
    });

    builder.addCase(
      loadCitiesForCountry.fulfilled,
      (state, action: PayloadAction<GetCitiesForCountryResponse>) => {
        state.cities = action.payload.cities;
        state.isLoadingCities = false;
      }
    );

    builder.addCase(loadCitiesForCountry.rejected, (state) => {
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

export const selectCanSaveExpense = createSelector([selectState], (state) => {
  return (
    state.selectedCountryId &&
    state.selectedCityId &&
    state.expenseAmount > 0 &&
    state.selectedCurrencyId &&
    state.selectedCategoryId
  );
});

export default newExpenseSlice.reducer;
