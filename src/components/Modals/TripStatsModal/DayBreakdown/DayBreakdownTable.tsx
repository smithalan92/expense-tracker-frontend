import format from "date-fns/format";
import { DayBreakdownTableProps } from "./DayBreakdownTable.types";

export default function UserBreakdownTable({
  dailyCostBreakdown,
}: DayBreakdownTableProps) {
  return (
    <table className="table table-compact w-full border-collapse">
      <colgroup>
        <col width="50%" />
        <col width="50%" />
      </colgroup>
      <thead>
        <tr>
          <th>Day</th>
          <th align="center">Amount</th>
        </tr>
      </thead>
      <tbody>
        {dailyCostBreakdown.map((d) => {
          return (
            <tr key={d.localDate}>
              <td>{format(new Date(d.localDate), "do MMM")}</td>
              <td align="center">€{d.euroTotal}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
