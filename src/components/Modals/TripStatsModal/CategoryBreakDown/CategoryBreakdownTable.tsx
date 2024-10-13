import { CategoryBreakdownResult } from "@/api";

export default function CategoryBreakdownTable({
  categoryBreakdown,
}: CategoryBreakdownTableProps) {
  return (
    <table className="table table-compact w-full border-collapse">
      <colgroup>
        <col width="50%" />
        <col width="50%" />
      </colgroup>
      <thead>
        <tr>
          <th>Category</th>
          <th align="center">Amount</th>
        </tr>
      </thead>
      <tbody>
        {categoryBreakdown.map((cb) => {
          return (
            <tr key={cb.categoryName}>
              <td>{cb.categoryName}</td>
              <td align="center">€{cb.totalEuroAmount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export interface CategoryBreakdownTableProps {
  categoryBreakdown: CategoryBreakdownResult[];
}
