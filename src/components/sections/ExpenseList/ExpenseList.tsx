import { useAppSelector } from "@/store";
import ExpenseListCards from "./ExpenseListCards/ExpenseListCards";
import ExpenseListTable from "./ExpenseListTable/ExpenseListTable";

export default function ExpenseList({
  onClickExpense,
}: {
  onClickExpense: (id: number) => void;
}) {
  const expenseListDisplayType = useAppSelector(
    (state) => state.userSettings.expenseView
  );

  if (expenseListDisplayType === "table")
    return <ExpenseListTable onClickExpense={onClickExpense} />;

  return <ExpenseListCards onClickExpense={onClickExpense} />;
}
