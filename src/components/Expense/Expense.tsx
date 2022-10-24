// import { PATHS } from "@/router";
// import { Link } from "react-router-dom";
import format from "date-fns/format";
import { useMemo } from "react";
import { ExpenseProps } from "./Expense.types";

export default function Expense({ expense }: ExpenseProps) {
  const formattedDate = useMemo(() => {
    return format(new Date(expense.localDateTime), "dd-MM-yyyy");
  }, [expense]);

  return (
    <tr className="hover cursor-pointer select-none">
      <td>{formattedDate}</td>
      <td className="text-ellipsis overflow-hidden">{expense.category.name}</td>
      <td className="text-ellipsis overflow-hidden">{expense.city.name}</td>
      <td align="center">€{expense.euroAmount}</td>
    </tr>
  );
}
