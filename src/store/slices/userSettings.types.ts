export type ExpenseViewType = "table" | "card";

export interface UserSettingsState {
  disableNativeSelectsOnMobile: boolean;
  expenseView: ExpenseViewType;
}
