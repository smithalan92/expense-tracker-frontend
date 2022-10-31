import { useAppSelector } from "@/store";
import { selectTrip } from "@/store/slices/tripData";

export default function ExpenseTableFooter() {
  const trip = useAppSelector(selectTrip);

  return (
    <tfoot>
      <tr className="sticky bottom-0 select-none">
        <td></td>
        <td align="right">Total</td>
        <td align="center">€{trip?.totalExpenseAmount}</td>
        <td colSpan={2}></td>
      </tr>
    </tfoot>
  );
}
