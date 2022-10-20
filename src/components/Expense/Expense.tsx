// import { PATHS } from "@/router";
// import { Link } from "react-router-dom";
import { ExpenseProps } from "./Expense.types";

export default function Expense({ expense }: ExpenseProps) {
  return (
    <tr className="hover cursor-pointer select-none">
      <td className="text-ellipsis overflow-hidden">{expense.name}</td>
      <td align="center">{expense.date}</td>
      <td align="center">€{expense.euroAmount}</td>
    </tr>
  );
}
