import type { TripExpense } from "@/api/expense";
import { RESTAURANTS, SNACKS_DRINKS } from "./categories";
import { CORK, DUBAI, IRELAND_WITH_CURRENCY, UAE_WITH_CURRENCY } from "./countries_cities";
import { AED, EURO } from "./currencies";
import { USER_ONE, USER_TWO } from "./users";

export const EURO_MOCK_EXPENSE_ONE: TripExpense = {
  id: 1,
  amount: "10.00",
  currency: EURO,
  euroAmount: "10.00",
  localDateTime: "2026-03-28T23:42:00",
  description: "Testing expense EURO",
  category: RESTAURANTS,
  city: CORK,
  country: { id: IRELAND_WITH_CURRENCY.id, name: IRELAND_WITH_CURRENCY.name },
  users: [USER_ONE],
  createdAt: "2026-03-28T23:43:14.000Z",
  updatedAt: "2026-03-28T23:43:14.000Z",
};

export const AED_MOCK_EXPENSE_ONE: TripExpense = {
  id: 2,
  amount: "20.00",
  currency: AED,
  euroAmount: "4.00",
  localDateTime: "2026-03-28T20:40:00",
  description: "Testing expense AED",
  category: SNACKS_DRINKS,
  city: DUBAI,
  country: { id: UAE_WITH_CURRENCY.id, name: UAE_WITH_CURRENCY.name },
  users: [USER_ONE, USER_TWO],
  createdAt: "2026-03-28T20:40:00:14.000Z",
  updatedAt: "2026-03-28T20:40:00:14.000Z",
};
