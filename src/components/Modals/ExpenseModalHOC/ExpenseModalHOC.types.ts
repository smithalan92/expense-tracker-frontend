export interface ExpenseData {
  date: string;
  amount: string | null;
  countryId: number | null;
  cityId: number | null;
  currencyId: number | null;
  categoryId: number | null;
  description: string;
  userId: number;
}

export interface ExpenseModalHOCProps {
  expenseId?: number;
  title: string;
  footer: JSX.Element | JSX.Element[];
  onChangeData: (d: ExpenseData) => void;
}
