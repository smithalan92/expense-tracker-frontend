import type { CreateTripPayload, GetTripEditDataResponse, Trip } from "@/api";
import * as api from "@/api";
import type { TripModalData } from "@/components/Modals/TripModalHOC/TripModalHOC";

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

const initialState: TripsState = {
  trips: [],
  isLoadingTrips: false,
  hasLoadedTrips: false,
  hasFailedToLoadTrips: false,
  shouldShowAddTripModal: false,
  isAddingTrip: false,
  hasAddingTripFailed: false,
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
    },
    setShouldShowAddTripModal: (state, action: PayloadAction<boolean>) => {
      state.shouldShowAddTripModal = action.payload;
    },
    updateTrip(state, action: PayloadAction<Trip>) {
      state.trips = state.trips.filter(({ id }) => id !== action.payload.id);
      state.trips.push(action.payload);
    },
    removeTrip(state, action: PayloadAction<number>) {
      state.trips = state.trips.filter(({ id }) => id !== action.payload);
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
  },
});

export const { resetState, setShouldShowAddTripModal, updateTrip, removeTrip } =
  tripSlice.actions;

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

export default tripSlice.reducer;

export interface TripsState {
  trips: Trip[];
  isLoadingTrips: boolean;
  hasLoadedTrips: boolean;
  hasFailedToLoadTrips: boolean;
  shouldShowAddTripModal: boolean;
  isAddingTrip: boolean;
  hasAddingTripFailed: boolean;
}

export interface CreateTripThunkPayload
  extends Omit<CreateTripPayload, "file"> {
  file?: File;
}

export interface UpdateTripThunkPayload {
  tripId: number;
  newData: TripModalData;
  oldData: GetTripEditDataResponse;
}
