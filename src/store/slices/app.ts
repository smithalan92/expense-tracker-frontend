import { LoginResponse } from "@/api.types";
import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { AppState, LoginThunkParams } from "./app.types";
import * as api from "@/api";
import { LOCALSTORAGE_KEY } from "@/constants";
import { resetState as resetTripState } from "./trips";

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
  localStorage.removeItem(LOCALSTORAGE_KEY);
  thunkApi.dispatch(resetTripState());
  thunkApi.dispatch(resetState());
});

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    restoreLocalStorage: (state) => {
      const data = localStorage.getItem(LOCALSTORAGE_KEY);

      if (data) {
        const { user, token }: LoginResponse = JSON.parse(data);
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
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(action.payload));
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
