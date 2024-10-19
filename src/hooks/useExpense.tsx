import { useMemo } from "react";
import useTripData from "./useTripData";

export default function useExpense({
  tripId,
  expenseId,
}: {
  tripId: number;
  expenseId: number;
}) {
  const { tripData } = useTripData(tripId);

  return useMemo(() => {
    if (!tripData) return null;

    return tripData.expenses.find((expense) => expense.id === expenseId);
  }, [expenseId, tripData]);
}
