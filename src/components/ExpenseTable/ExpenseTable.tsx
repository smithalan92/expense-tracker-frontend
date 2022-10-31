import Expense from "@/components/Expense/Expense";
import { useAppSelector } from "@/store";
import { selectExpenses } from "@/store/slices/tripData";
import ExpenseTableFooter from "@/components/ExpenseTableFooter/ExpenseTableFooter";

export default function ExpenseTable({
  onClickExpense,
}: {
  onClickExpense: (id: number) => void;
}) {
  const expenses = useAppSelector(selectExpenses)!;

  return (
    <div className="overflow-y-scroll overflow-x-auto w-full h-100">
      <table className="table table-compact w-full border-collapse">
        <thead className="sticky top-0">
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>City</th>
            <th align="center">Local</th>
            <th align="center">Euro</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            return (
              <Expense
                key={expense.id}
                expense={expense}
                onClick={onClickExpense}
              />
            );
          })}
          {expenses.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No expenses available.
              </td>
            </tr>
          )}
        </tbody>
        {expenses.length > 0 && <ExpenseTableFooter />}
      </table>
    </div>
  );
}
