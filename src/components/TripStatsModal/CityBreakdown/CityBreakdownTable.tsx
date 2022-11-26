import { CityBreakdownTableProps } from "./CityBreakdownTable.types";

export default function CityBreakdownTable({
  cityBreakdown,
}: CityBreakdownTableProps) {
  return (
    <div className="overflow-x-scroll">
      <table className="table table-compact w-full border-collapse">
        <thead>
          <tr>
            <th></th>
            <th>Category</th>
            <th align="center">Amount</th>
            <th align="center">Local Amount</th>
          </tr>
        </thead>
        <tbody>
          {cityBreakdown.map((cb) => {
            return (
              <tr key={cb.name}>
                <td />
                <td>{cb.name}</td>
                <td align="center">€{cb.euroTotal}</td>
                <td align="center">
                  {cb.localAmount} {cb.localCurrency}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
