import Expense from "@/components/Expense/Expense";
import { useAppSelector } from "@/store";
import { selectExpenses } from "@/store/slices/expenses";
import ExpenseTableFooter from "@/components/ExpenseTableFooter/ExpenseTableFooter";

export default function ExpenseTable() {
  const expenses = useAppSelector(selectExpenses)!;

  return (
    <div className="overflow-y-scroll h-140">
      <table className="table table-compact w-full border-collapse">
        <colgroup>
          <col width="50%" />
          <col width="25%" />
          <col width="25%" />
        </colgroup>
        <thead className="sticky top-0">
          <tr>
            <th>Category</th>
            <th align="center">Date</th>
            <th align="center">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            return <Expense key={expense.id} expense={expense} />;
          })}
        </tbody>
        <ExpenseTableFooter />
      </table>
    </div>
  );
}
