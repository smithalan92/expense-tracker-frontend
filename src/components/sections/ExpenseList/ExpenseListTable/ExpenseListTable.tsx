import TableExpense from "@/components/sections/ExpenseList/ExpenseListTable/TableExpense";
import { useAppSelector } from "@/store";
import { selectExpenses, selectTrip } from "@/store/slices/tripData";

export default function ExpenseListTable({
  onClickExpense,
}: {
  onClickExpense: (id: number) => void;
}) {
  const expenses = useAppSelector(selectExpenses)!;
  const trip = useAppSelector(selectTrip);

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
              <TableExpense
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
        {expenses.length > 0 && (
          <tfoot>
            <tr className="sticky bottom-[-1px] select-none">
              <td colSpan={2} className="pb-[12px]"></td>
              <td align="right" className="pb-[12px]">
                Total
              </td>
              <td align="center" className="pb-[12px]">
                €{trip?.totalExpenseAmount}
              </td>
              <td colSpan={3} className="pb-[12px]"></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
