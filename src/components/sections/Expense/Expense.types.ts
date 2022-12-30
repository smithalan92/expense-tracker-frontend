import { ParsedTripExpense } from "@/store/slices/tripData.types";

export interface ExpenseProps {
  expense: ParsedTripExpense;
  onClick: (id: number) => void;
}
