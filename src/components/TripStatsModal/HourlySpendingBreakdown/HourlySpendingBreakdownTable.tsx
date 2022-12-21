import { HourlySpendingBreakdownTableProps } from "./HourlySpendingBreakdownTable.types";

export default function UserBreakdownTable({
  hourlySpendingBreakdown,
}: HourlySpendingBreakdownTableProps) {
  const total = hourlySpendingBreakdown.reduce((acc, current) => {
    return (acc += current.total);
  }, 0);

  console.log(total);

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
