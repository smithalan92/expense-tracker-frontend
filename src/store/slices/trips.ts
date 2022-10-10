import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { TripState } from "./trips.types";
import * as api from "@/api";
import { Trip } from "@/api.types";

const initialState: TripState = {
  trips: [],
  isLoadingTrips: false,
  hasLoadedTrips: false,
  hasFailedToLoadTrips: false,
};

export const loadTrips = createAsyncThunk("trips/loadTrips", () => {
  return api.getTrips();
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

const selectTripState = ({ trips }: { trips: TripState }) => trips;

export const selectTrips = createSelector(
  [selectTripState],
  (tripState) => tripState.trips
);

export const selectIsLoadingTrips = createSelector(
  [selectTripState],
  (tripState) => tripState.isLoadingTrips
);

export const selectHasLoadedTrips = createSelector(
  [selectTripState],
  (tripState) => tripState.hasLoadedTrips
);

export default tripSlice.reducer;
