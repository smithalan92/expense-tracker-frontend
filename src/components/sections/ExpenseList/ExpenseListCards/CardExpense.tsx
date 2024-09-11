import { ReactComponent as LocationIcon } from "@/assets/location.svg";
import { ParsedTripExpense } from "@/store/slices/tripData.types";
import { format } from "date-fns";
import { useMemo } from "react";
import ExpenseCategoryIcon from "./ExpenseCategoryIcon";

export interface CardExpenseProps {
  expense: ParsedTripExpense;
  onClick: (id: number) => void;
}

export default function CardExpense({ expense, onClick }: CardExpenseProps) {
  const date = useMemo(() => new Date(expense.localDateTime), [expense]);
  const expenseTime = useMemo(() => format(date, "HH:mm"), [date]);
  const expenseDay = useMemo(() => format(date, "do"), [date]);
  const expenseMonth = useMemo(() => format(date, "MMM"), [date]);
  const userInitals = useMemo(() => {
    const firstNameLetter = expense.user.firstName.slice(0, 1).toUpperCase();
    const lastNameLetter = expense.user.lastName.slice(0, 1).toUpperCase();
    return `${firstNameLetter}${lastNameLetter}`;
  }, [expense]);

  return (
    <div
      data-expense-id={expense.id}
      className="flex border-t border-b border-l even:border-t-0 even:border-b-0 border-solid border-gray-300 cursor-pointer hover:bg-gray-200"
      onClick={() => onClick(expense.id)}
    >
      <div className="flex px-1 py-1 bg-primary text-white border-b border-solid border-white">
        <div className="flex h-full flex-col items-center justify-center w-16">
          <span className="font-bold text-sm">
            {expenseDay} {expenseMonth}
          </span>
          <span className="text-xs">{expenseTime}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-2 flex-nowrap overflow-hidden">
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
}
