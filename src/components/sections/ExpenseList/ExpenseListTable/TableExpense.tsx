import type { ParsedTripExpense } from "@/store/slices/tripData";
import format from "date-fns/format";
import { useMemo } from "react";

export interface TableExpenseProps {
  expense: ParsedTripExpense;
  onClick: (id: number) => void;
}

export default function TableExpense({ expense, onClick }: TableExpenseProps) {
  const formattedDate = useMemo(() => {
    return format(new Date(expense.localDateTime), "do MMM HH:mm");
  }, [expense]);

  return (
    <>
      {expense.isSaved && (
        <tr
          className="hover cursor-pointer select-none"
          onClick={() => onClick(expense.id)}
        >
          <td></td>
          <td>{formattedDate}</td>
          <td>{expense.category.name}</td>
          <td align="center">€{expense.euroAmount}</td>
          <td align="center">{expense.city.name}</td>
          <td align="center">
            {expense.amount} {expense.currency.code}
          </td>
          <td className="px-4">{expense.user.firstName}</td>
        </tr>
      )}
      {!expense.isSaved && (
        <tr
          className="hover cursor-pointer select-none"
          onClick={() => onClick(expense.id)}
        >
          <td className="bg-rose-400"></td>
          <td className="bg-rose-400">{formattedDate}</td>
          <td className="text-ellipsis overflow-hidden bg-rose-400">
            {expense.category.name}
          </td>
          <td align="center" className=" bg-rose-400">
            {expense.euroAmount}
          </td>
          <td
            align="center"
            className="text-ellipsis overflow-hidden bg-rose-400"
          >
            {expense.city.name}
          </td>
          <td align="center" className="bg-rose-400">
            {expense.amount} {expense.currency.code}
          </td>
          <td className="px-4 bg-rose-400">{expense.user.firstName}</td>
        </tr>
      )}
    </>
  );
}
