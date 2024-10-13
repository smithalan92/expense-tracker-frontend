import { HourlySpendingResult } from "@/api";

export default function UserBreakdownTable({
  hourlySpendingBreakdown,
}: HourlySpendingBreakdownTableProps) {
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
        {hourlySpendingBreakdown.map((d) => {
          return (
            <tr key={d.hour}>
              <td>{d.hour}</td>
              <td align="center">€{d.total}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export interface HourlySpendingBreakdownTableProps {
  hourlySpendingBreakdown: HourlySpendingResult[];
}
