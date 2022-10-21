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
  countries: [],
  isLoadingCountries: false,
  hasLoadingCountriesFailed: false,
  cities: [],
  isLoadingCities: false,
  hasLoadingCitiesFailed: false,
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

export const newExpenseSlice = createSlice({
  name: "newExpense",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoadingCountries = false;
      state.hasLoadingCountriesFailed = false;
      state.countries = [];
      state.cities = [];
      state.isLoadingCities = false;
      state.hasLoadingCitiesFailed = false;
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
  },
});

export const { resetState } = newExpenseSlice.actions;

const selectState = ({ newExpense }: { newExpense: NewExpenseState }) =>
  newExpense;

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

export default newExpenseSlice.reducer;
