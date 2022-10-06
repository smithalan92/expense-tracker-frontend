import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { AppState, User } from "./app.types";

const initialState: AppState = {
  user: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = appSlice.actions;

const selectAppState = ({ app }: { app: AppState }) => app;

export const selectUser = createSelector(
  [selectAppState],
  (appState) => appState.user
);

export default appSlice.reducer;
