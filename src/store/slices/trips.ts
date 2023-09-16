import * as api from "@/api";
import { Trip, UpdateTripPayload } from "@/api.types";
import {
  LOCALSTORAGE_TRIPS_KEY,
  getStorageItem,
  setStorageItem,
} from "@/utils/localStorage";
import {
  areUserIdsDifferent,
  isAnyCountryDataDifferent,
  isDateDifferent,
  isTripNameDifferent,
} from "@/utils/trip";
import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  CreateTripThunkPayload,
  TripsState,
  UpdateTripThunkPayload,
} from "./trips.types";

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
  isUpdatingTrip: false,
  hasUpdatingTripFailed: false,
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

export const updateTrip = createAsyncThunk(
  "trips/updateTrip",
  async ({ tripId, newData, oldData }: UpdateTripThunkPayload) => {
    let file;
    if (newData.file) {
      file = await api.uploadFile(newData.file);
    }

    const updatePayload: UpdateTripPayload = {};

    if (isTripNameDifferent(newData.name, oldData.name)) {
      updatePayload.name = newData.name;
    }

    if (isDateDifferent(newData.startDate, oldData.startDate)) {
      updatePayload.startDate = newData.startDate;
    }

    if (isDateDifferent(newData.endDate, oldData.endDate)) {
      updatePayload.endDate = newData.endDate;
    }

    if (areUserIdsDifferent(newData.userIds, oldData.userIds)) {
      updatePayload.userIds = newData.userIds;
    }
    if (isAnyCountryDataDifferent(newData.countries, oldData.countries)) {
      updatePayload.countries = newData.countries;
    }

    return api.updateTrip(tripId, {
      ...updatePayload,
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
    resetUpdateTripStatus: (state) => {
      state.isUpdatingTrip = false;
      state.hasUpdatingTripFailed = false;
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
    builder.addCase(updateTrip.pending, (state) => {
      state.isUpdatingTrip = true;
      state.hasUpdatingTripFailed = false;
    });
    builder.addCase(updateTrip.fulfilled, (state, action) => {
      const updatedTrip = action.payload;

      state.trips = state.trips.filter((t) => t.id !== updatedTrip.id);
      state.trips.push(updatedTrip);

      state.isUpdatingTrip = false;
    });
    builder.addCase(updateTrip.rejected, (state) => {
      state.isUpdatingTrip = false;
      state.hasUpdatingTripFailed = true;
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

export const { resetState, setShouldShowAddTripModal, resetUpdateTripStatus } =
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

export const selectIsDeletingTrip = createSelector(
  [selectTripDataState],
  (state) => state.isDeletingTrip
);

export const selectHasDeletingTripFailed = createSelector(
  [selectTripDataState],
  (state) => state.hasDeletingTripFailed
);

export default tripSlice.reducer;
