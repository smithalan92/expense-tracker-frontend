import { LoginResponse } from "@/api.types";
import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { AppState, LoginThunkParams } from "./app.types";
import * as api from "@/api";
import { resetState as resetTripsState } from "./trips";
import { resetState as resetTripDataState } from "./tripData";
import {
  deleteAllLocalStorage,
  getStorageItem,
  LOCALSTORAGE_AUTH_KEY,
  setStorageItem,
} from "@/utils/localStorage";

const initialState: AppState = {
  user: null,
  isLoggingIn: false,
  hasFailedToLogin: false,
};

export const login = createAsyncThunk(
  "app/login",
  ({ email, password }: LoginThunkParams) => {
    return api.login({ email, password });
  }
);

export const logout = createAsyncThunk("app/logout", (_, thunkApi) => {
  deleteAllLocalStorage();
  thunkApi.dispatch(resetTripsState());
  thunkApi.dispatch(resetTripDataState());
  thunkApi.dispatch(resetState());
});

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    restoreLocalStorage: (state) => {
      const data = getStorageItem(LOCALSTORAGE_AUTH_KEY);
      if (data) {
        const { user, token } = data as any;
        state.user = user;
        api.createInstance(token.token);
      }
    },
    resetState: (state) => {
      state.user = null;
      state.isLoggingIn = false;
      state.hasFailedToLogin = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(login.pending, (state) => {
      state.isLoggingIn = true;
      state.hasFailedToLogin = false;
    });
    builder.addCase(
      login.fulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        setStorageItem(LOCALSTORAGE_AUTH_KEY, action.payload);
        api.createInstance(action.payload.token.token);

        state.user = action.payload.user;
        state.isLoggingIn = false;
      }
    );
    builder.addCase(login.rejected, (state) => {
      state.hasFailedToLogin = true;
      state.isLoggingIn = false;
    });
  },
});

export const { restoreLocalStorage, resetState } = appSlice.actions;

const selectAppState = ({ app }: { app: AppState }) => app;

export const selectUser = createSelector(
  [selectAppState],
  (appState) => appState.user
);

export const selectIsLoggingIn = createSelector(
  [selectAppState],
  (appState) => appState.isLoggingIn
);

export const selectHasLoggingInFailed = createSelector(
  [selectAppState],
  (appState) => appState.hasFailedToLogin
);

export const selectIsLoggedIn = createSelector(
  [selectAppState],
  (appState) => appState.user !== null
);

export default appSlice.reducer;
