import { useAppSelector } from "@/store";
import { selectTrip } from "@/store/slices/tripData";

export default function ExpenseTableFooter() {
  const trip = useAppSelector(selectTrip);

  return (
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
  );
}
