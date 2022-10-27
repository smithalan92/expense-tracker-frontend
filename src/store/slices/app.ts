import { Currency, LoginResponse } from "@/api.types";
import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { AppState, LoginThunkParams } from "./app.types";
import * as api from "@/api";
import { resetState as resetTripState } from "./trips";
import {
  deleteStorageItem,
  getStorageItem,
  LOCALSTORAGE_AUTH_KEY,
  LOCALSTORAGE_CURRENCIES_KEY,
  setStorageItem,
} from "@/utils/localStorage";
import axios from "axios";

const initialState: AppState = {
  user: null,
  isLoggingIn: false,
  hasFailedToLogin: false,
  currencies: [],
  isLoadingCurrencies: false,
  hasFailedToLoadCurrencies: false,
};

export const login = createAsyncThunk(
  "app/login",
  ({ email, password }: LoginThunkParams) => {
    return api.login({ email, password });
  }
);

export const loadCurrencies = createAsyncThunk(
  "app/loadCurrencies",
  async () => {
    try {
      const result = await api.getCurrencies();
      setStorageItem(LOCALSTORAGE_CURRENCIES_KEY, result);
      return result;
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
        const savedResult = getStorageItem<Currency[]>(
          LOCALSTORAGE_CURRENCIES_KEY
        );
        if (savedResult) return savedResult;
      }
      throw err;
    }
  }
);

export const logout = createAsyncThunk("app/logout", (_, thunkApi) => {
  deleteStorageItem(LOCALSTORAGE_AUTH_KEY);
  thunkApi.dispatch(resetTripState());
  thunkApi.dispatch(resetState());
});

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    restoreLocalStorage: (state) => {
      const data = getStorageItem(LOCALSTORAGE_AUTH_KEY);
      console.log(data);
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
    builder.addCase(loadCurrencies.pending, (state) => {
      state.isLoadingCurrencies = true;
    });
    builder.addCase(
      loadCurrencies.fulfilled,
      (state, action: PayloadAction<Currency[]>) => {
        state.currencies = action.payload;
        state.isLoadingCurrencies = false;
      }
    );
    builder.addCase(loadCurrencies.rejected, (state) => {
      state.hasFailedToLoadCurrencies = true;
      state.isLoadingCurrencies = false;
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

export const selectCurrencies = createSelector(
  [selectAppState],
  (appState) => appState.currencies
);

export default appSlice.reducer;
