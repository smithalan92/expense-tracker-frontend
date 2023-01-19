import { CountryBreakdownTableProps } from "./CountryBreakdownTable.types";

export default function CountryBreakdownTable({
  countryBreakdown,
}: CountryBreakdownTableProps) {
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
          {countryBreakdown.map((cb) => {
            return (
              <tr key={cb.name}>
                <td />
                <td>{cb.name}</td>
                <td align="center">€{cb.euroTotal}</td>
                <td align="center">
                  {cb.localTotal} {cb.localCurrency}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
