import { useAppSelector } from "@/store";
import { selectExpenses, selectTrip } from "@/store/slices/tripData";
import CardExpense from "./CardExpense";

export default function ExpenseListCards({
  onClickExpense,
}: {
  onClickExpense: (id: number) => void;
}) {
  const expenses = useAppSelector(selectExpenses)!;
  const trip = useAppSelector(selectTrip);

  return (
    <div className="relative">
      <div className="overflow-y-scroll overflow-x-auto w-full h-full pr-2 flex flex-col">
        {expenses.map((expense) => {
          return (
            <CardExpense
              key={expense.id}
              expense={expense}
              onClick={onClickExpense}
            />
          );
        })}
        {expenses.length === 0 && (
          <div className="flex flex-1 items-center">
            <span>No expenses available.</span>
          </div>
        )}
      </div>
      {expenses.length > 0 && (
        <div className="sticky bottom-[-1px] select-none bg-base-200 mr-2">
          <div className="text-right w-full py-2 pr-4 font-semibold">
            Total: €{trip?.totalExpenseAmount}
          </div>
        </div>
      )}
    </div>
  );
}
