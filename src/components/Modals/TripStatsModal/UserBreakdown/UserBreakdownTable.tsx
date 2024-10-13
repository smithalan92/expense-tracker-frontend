import { UserBreakdownResult } from "@/api";

export default function UserBreakdownTable({
  userBreakdown,
}: UserBreakdownTableProps) {
  return (
    <table className="table table-compact w-full border-collapse">
      <colgroup>
        <col width="50%" />
        <col width="50%" />
      </colgroup>
      <thead>
        <tr>
          <th>User</th>
          <th align="center">Amount</th>
        </tr>
      </thead>
      <tbody>
        {userBreakdown.map((u) => {
          return (
            <tr key={u.userFirstName}>
              <td>{u.userFirstName}</td>
              <td align="center">€{u.totalEuroAmount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export interface UserBreakdownTableProps {
  userBreakdown: UserBreakdownResult[];
}
