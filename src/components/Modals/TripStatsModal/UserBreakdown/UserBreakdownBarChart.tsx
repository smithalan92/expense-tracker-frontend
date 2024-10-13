import { UserBreakdownResult } from "@/api";
import BarChart from "@/components/widgets/Charts/BarChart";
import { useMemo } from "react";

export default function UserBreakdownBarChart({
  userBreakdown,
}: UserBreakdownBarChartProps) {
  const labels = useMemo(() => {
    return userBreakdown.map((u) => u.userFirstName);
  }, [userBreakdown]);

  const values = useMemo(() => {
    return userBreakdown.map((u) => u.totalEuroAmount);
  }, [userBreakdown]);

  return (
    <div className="flex items-center justify-center">
      <BarChart
        labels={labels}
        values={values}
        isCurrencyValue={true}
        isVerticalChart={true}
        dataLabel="Spent"
      />
    </div>
  );
}

export interface UserBreakdownBarChartProps {
  userBreakdown: UserBreakdownResult[];
}
