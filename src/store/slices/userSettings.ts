import {
  getExpenseViewConfigKey,
  getMobileSelectConfigKey,
  getStorageItem,
  setStorageItem,
} from "@/utils/localStorage";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: UserSettingsState = {
  disableNativeSelectsOnMobile:
    getStorageItem<boolean>(getMobileSelectConfigKey()) ?? false,
  expenseView:
    getStorageItem<ExpenseViewType>(getExpenseViewConfigKey()) ?? "card",
};

export const userSettingsSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    toggleNativeMobileSelectsDisabled: (state) => {
      state.disableNativeSelectsOnMobile = !state.disableNativeSelectsOnMobile;
      setStorageItem(
        getMobileSelectConfigKey(),
        state.disableNativeSelectsOnMobile
      );
    },

    setExpenseViewType: (state, action: PayloadAction<ExpenseViewType>) => {
      state.expenseView = action.payload;
      setStorageItem(getExpenseViewConfigKey(), state.expenseView);
    },
  },
});

export const { toggleNativeMobileSelectsDisabled, setExpenseViewType } =
  userSettingsSlice.actions;

export const selectUserPreferencesState = ({
  userPreferences,
}: {
  userPreferences: UserSettingsState;
}) => userPreferences;

export default userSettingsSlice.reducer;

export type ExpenseViewType = "table" | "card";

export interface UserSettingsState {
  disableNativeSelectsOnMobile: boolean;
  expenseView: ExpenseViewType;
}
