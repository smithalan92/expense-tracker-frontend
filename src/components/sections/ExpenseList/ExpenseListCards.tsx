import { ReactComponent as LocationIcon } from "@/assets/location.svg";
import { useAppSelector } from "@/store";
import { selectExpenses, selectTrip } from "@/store/slices/tripData";
import { format } from "date-fns";
import ExpenseCategoryIcon from "../ExpenseList/ExpenseCategoryIcon";

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
          const date = new Date(expense.localDateTime);
          const expenseTime = format(date, "HH:mm");
          const expenseDay = format(date, "do");
          const expenseMonth = format(date, "MMM");
          const userInitals = `${expense.user.firstName.slice(
            0,
            1
          )}${expense.user.lastName.slice(0, 1)}`.toUpperCase();

          return (
            <div
              className="flex border-t border-b border-l even:border-t-0 even:border-b-0 border-solid border-gray-300"
              key={expense.id}
              onClick={() => onClickExpense(expense.id)}
            >
              <div className="flex px-1 py-1 bg-primary text-white border-b border-solid border-white">
                <div className="flex h-full flex-col items-center justify-center w-16">
                  <span className="font-bold text-sm">
                    {expenseDay} {expenseMonth}
                  </span>
                  <span className="text-xs">{expenseTime}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-2 flex-nowrap">
                <div className="flex items-center w-full flex-nowrap">
                  <LocationIcon className="w-4" />
                  <span className="ml-2 whitespace-nowrap text-ellipsis overflow-hidden font-semibold">
                    {expense.city.name}
                  </span>
                </div>
                <div className="mt-1 flex items-center w-full flex-nowrap">
                  <ExpenseCategoryIcon
                    className="w-4"
                    categoryId={expense.category.id}
                  />
                  <span className="ml-2 whitespace-nowrap text-ellipsis overflow-hidden">
                    {expense.category.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center px-4">
                <span className="font-bold">€{expense.euroAmount}</span>
              </div>
              <div className="flex items-center justify-center bg-primary w-10">
                <span className="text-white font-bold">{userInitals}</span>
              </div>
            </div>
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
