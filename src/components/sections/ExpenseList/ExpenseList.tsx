import { useAppSelector } from "@/store";

import ExpenseListCards from "./ExpenseListCards/ExpenseListCards";
import ExpenseListTable from "./ExpenseListTable/ExpenseListTable";

export default function ExpenseList({
  tripId,
  onClickExpense,
}: {
  tripId: number;
  onClickExpense: (id: number) => void;
}) {
  const expenseListDisplayType = useAppSelector(
    (state) => state.userSettings.expenseView
  );

  if (expenseListDisplayType === "table")
    return <ExpenseListTable tripId={tripId} onClickExpense={onClickExpense} />;

  return <ExpenseListCards tripId={tripId} onClickExpense={onClickExpense} />;
}
