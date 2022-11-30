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
    <div className="overflow-y-scroll overflow-x-auto w-full h-full pr-2">
      <table className="table table-compact w-full border-collapse">
        <thead className="sticky top-0">
          <tr>
            <th className="pb-[12px]"></th>
            <th className="pb-[12px]">Date</th>
            <th className="pb-[12px]">Category</th>
            <th align="center" className="pb-[12px]">
              Euro Amount
            </th>
            <th align="center" className="pb-[12px]">
              City
            </th>
            <th align="center" className="pb-[12px]">
              Local Amount
            </th>
            <th align="center" className="px-4 pb-[12px]">
              Who
            </th>
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
              <td colSpan={7} style={{ textAlign: "center" }}>
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
