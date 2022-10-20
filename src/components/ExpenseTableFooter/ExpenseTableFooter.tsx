import { useAppSelector } from "@/store";
import { selectExpenseTrip } from "@/store/slices/expenses";

export default function ExpenseTableFooter() {
  const trip = useAppSelector(selectExpenseTrip);

  return (
    <tfoot>
      <tr className="sticky bottom-0 select-none">
        <td></td>
        <td align="right">Total</td>
        <td align="center">€{trip!.totalExpenseAmount}</td>
      </tr>
    </tfoot>
  );
}
