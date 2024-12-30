import getAxios from "./axios";

export function addExpensesToTrip(tripId: number, expenses: ExpensePayload[]) {
  return getAxios().post<AddExpensesToTripResponse>(`/v2/expenses/${tripId}/add`, { expenses });
}

export async function deleteExpense(expenseId: number) {
  return getAxios().delete(`/v2/expenses/${expenseId}`);
}

export async function updateExpense(expenseId: number, payload: UpdateExpensePayload) {
  const { data } = await getAxios().patch<UpdateExpenseResponse>(`/v2/expenses/${expenseId}`, {
    ...payload,
  });

  return data;
}

export interface ExpensePayload {
  localDateTime: string;
  cityId: number;
  amount: number;
  currencyId: number;
  categoryId: number;
  description: string;
  userId: number;
}

export interface TripExpense {
  id: number;
  amount: string;
  currency: ExpenseCurrency;
  euroAmount: string;
  localDateTime: string;
  description: string;
  category: ExpenseCategory;
  city: ExpenseCity;
  country: ExpenseCountry;
  user: ExpenseUser;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCountry {
  id: number;
  name: string;
}

export interface ExpenseUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface ExpenseCurrency {
  id: number;
  code: string;
  name: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
}

export interface ExpenseCity {
  id: number;
  name: string;
  timezone: string;
}

export interface AddExpensesToTripResponse {
  expenses: TripExpense[];
}

export interface UpdateExpenseResponse {
  expense: TripExpense;
}

export type UpdateExpensePayload = Partial<ExpensePayload>;
