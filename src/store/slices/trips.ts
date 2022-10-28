import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { TripsState } from "./trips.types";
import * as api from "@/api";
import { Trip } from "@/api.types";
import {
  getStorageItem,
  LOCALSTORAGE_TRIPS_KEY,
  setStorageItem,
} from "@/utils/localStorage";
import axios from "axios";

const initialState: TripsState = {
  trips: [],
  isLoadingTrips: false,
  hasLoadedTrips: false,
  hasFailedToLoadTrips: false,
};

export const loadTrips = createAsyncThunk("trips/loadTrips", async () => {
  try {
    const result = await api.getTrips();
    setStorageItem(LOCALSTORAGE_TRIPS_KEY, result);
    return result;
  } catch (err) {
    if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
      const savedTrips = getStorageItem<Trip[]>(LOCALSTORAGE_TRIPS_KEY);
      if (savedTrips) return savedTrips;
    }
    throw err;
  }
});

export const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    resetState: (state) => {
      state.trips = [];
      state.isLoadingTrips = false;
      state.hasFailedToLoadTrips = false;
      state.hasLoadedTrips = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(loadTrips.pending, (state) => {
      state.isLoadingTrips = true;
      state.hasLoadedTrips = false;
      state.hasFailedToLoadTrips = false;
    });
    builder.addCase(
      loadTrips.fulfilled,
      (state, action: PayloadAction<Trip[]>) => {
        state.trips = action.payload;
        state.isLoadingTrips = false;
        state.hasLoadedTrips = true;
      }
    );
    builder.addCase(loadTrips.rejected, (state) => {
      state.hasFailedToLoadTrips = true;
      state.isLoadingTrips = false;
    });
  },
});

export const { resetState } = tripSlice.actions;

const selectTripDataState = ({ trips }: { trips: TripsState }) => trips;

export const selectTrips = createSelector(
  [selectTripDataState],
  (TripDataState) => TripDataState.trips
);

export const selectIsLoadingTrips = createSelector(
  [selectTripDataState],
  (TripDataState) => TripDataState.isLoadingTrips
);

export const selectHasLoadedTrips = createSelector(
  [selectTripDataState],
  (TripDataState) => TripDataState.hasLoadedTrips
);

export const selectHasFailedToLoadTrips = createSelector(
  [selectTripDataState],
  (TripDataState) => TripDataState.hasFailedToLoadTrips
);

export default tripSlice.reducer;
