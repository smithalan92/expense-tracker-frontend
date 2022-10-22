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
      state.selectedCountryId = null;
      state.countries = [];
      state.isLoadingCountries = false;
      state.hasLoadingCountriesFailed = false;
      state.selectedCityId = null;
      state.cities = [];
      state.isLoadingCities = false;
      state.hasLoadingCitiesFailed = false;
    },
    setSelectedCountryId: (state, action: PayloadAction<number>) => {
      state.selectedCountryId = action.payload;
      state.selectedCityId = null;
      state.cities = [];
    },
    setSelectedCityId: (state, action: PayloadAction<number>) => {
      state.selectedCityId = action.payload;
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

export const { resetState, setSelectedCountryId, setSelectedCityId } =
  newExpenseSlice.actions;

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

export default newExpenseSlice.reducer;
