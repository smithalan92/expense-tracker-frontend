// import { PATHS } from "@/router";
// import { Link } from "react-router-dom";
import format from "date-fns/format";
import { useMemo } from "react";
import { ExpenseProps } from "./Expense.types";

export default function Expense({ expense, onClick }: ExpenseProps) {
  const formattedDate = useMemo(() => {
    return format(new Date(expense.localDateTime), "dd-MM-yyyy HH:mm");
  }, [expense]);

  return (
    <>
      {expense.isSaved && (
        <tr
          className="hover cursor-pointer select-none"
          onClick={() => onClick(expense.id)}
        >
          <td>{formattedDate}</td>
          <td>
            {expense.category.name}
          </td>
          <td align="center">€{expense.euroAmount}</td>
          <td align="center">{expense.city.name}</td>
          <td align="center">{expense.amount} {expense.currency.code}</td>
          
        </tr>
      )}
      {!expense.isSaved && (
        <tr
          className="hover cursor-pointer select-none"
          onClick={() => onClick(expense.id)}
        >
          <td className="bg-rose-900">{formattedDate}</td>
          <td className="text-ellipsis overflow-hidden bg-rose-900">
            {expense.category.name}
          </td>
          <td className="text-ellipsis overflow-hidden bg-rose-900">
            {expense.city.name}
          </td>
          <td align="center" className=" bg-rose-900">
            {expense.euroAmount}
          </td>
        </tr>
      )}
    </>
  );
}
