import * as api from "@/api";
import { Trip } from "@/api.types";
import {
  LOCALSTORAGE_TRIPS_KEY,
  getStorageItem,
  setStorageItem,
} from "@/utils/localStorage";
import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { CreateTripThunkPayload, TripsState } from "./trips.types";

const initialState: TripsState = {
  trips: [],
  isLoadingTrips: false,
  hasLoadedTrips: false,
  hasFailedToLoadTrips: false,
  shouldShowAddTripModal: false,
  isAddingTrip: false,
  hasAddingTripFailed: false,
  isDeletingTrip: false,
  hasDeletingTripFailed: false,
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

export const addTrip = createAsyncThunk(
  "trips/addTrip",
  async (payload: CreateTripThunkPayload) => {
    let file;
    if (payload.file) {
      file = await api.uploadFile(payload.file);
    }

    return api.createTrip({
      ...payload,
      file,
    });
  }
);

export const deleteTrip = createAsyncThunk(
  "trips/deleteTrip",
  async (tripId: number) => {
    await api.deleteTrip(tripId);

    return tripId;
  }
);

export const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    resetState: (state) => {
      state.trips = [];
      state.isLoadingTrips = false;
      state.hasFailedToLoadTrips = false;
      state.hasLoadedTrips = false;
      state.shouldShowAddTripModal = false;
      state.isAddingTrip = false;
      state.hasAddingTripFailed = false;
      state.isDeletingTrip = false;
      state.hasDeletingTripFailed = false;
    },
    setShouldShowAddTripModal: (state, action: PayloadAction<boolean>) => {
      state.shouldShowAddTripModal = action.payload;
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
    builder.addCase(addTrip.pending, (state) => {
      state.isAddingTrip = true;
    });
    builder.addCase(addTrip.fulfilled, (state, action) => {
      state.trips.push(action.payload);
      state.isAddingTrip = false;
      state.shouldShowAddTripModal = false;
    });
    builder.addCase(addTrip.rejected, (state) => {
      state.isAddingTrip = false;
      state.hasAddingTripFailed = true;
    });
    builder.addCase(deleteTrip.pending, (state) => {
      state.isDeletingTrip = true;
    });
    builder.addCase(deleteTrip.fulfilled, (state, action) => {
      state.trips = state.trips.filter(({ id }) => id !== action.payload);
      state.isDeletingTrip = false;
    });
    builder.addCase(deleteTrip.rejected, (state) => {
      state.isDeletingTrip = false;
      state.hasDeletingTripFailed = true;
    });
  },
});

export const { resetState, setShouldShowAddTripModal } = tripSlice.actions;

const selectTripDataState = ({ trips }: { trips: TripsState }) => trips;

export const selectTrips = createSelector(
  [selectTripDataState],
  (state) => state.trips
);

export const selectIsLoadingTrips = createSelector(
  [selectTripDataState],
  (state) => state.isLoadingTrips
);

export const selectHasLoadedTrips = createSelector(
  [selectTripDataState],
  (state) => state.hasLoadedTrips
);

export const selectHasFailedToLoadTrips = createSelector(
  [selectTripDataState],
  (state) => state.hasFailedToLoadTrips
);

export const selectShouldShowAddTripModal = createSelector(
  [selectTripDataState],
  (state) => state.shouldShowAddTripModal
);

export const selectIsAddingTrip = createSelector(
  [selectTripDataState],
  (state) => state.isAddingTrip
);

export const selectHasAddingTripFailed = createSelector(
  [selectTripDataState],
  (state) => state.hasAddingTripFailed
);

export const selectIsDeletingTrip = createSelector(
  [selectTripDataState],
  (state) => state.isDeletingTrip
);

export const selectHasDeletingTripFailed = createSelector(
  [selectTripDataState],
  (state) => state.hasDeletingTripFailed
);

export default tripSlice.reducer;
