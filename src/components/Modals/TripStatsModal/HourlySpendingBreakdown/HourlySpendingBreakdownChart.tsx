import { HourlySpendingResult } from "@/api";
import BarChart from "@/components/widgets/Charts/BarChart";
import { useMemo } from "react";

export default function HourlySpendingBreakdownChart({
  hourlySpendingBreakdown,
}: HourlySpendingBreakdownChartProps) {
  const labels = useMemo(() => {
    return hourlySpendingBreakdown.map((d) => d.hour);
  }, [hourlySpendingBreakdown]);

  const values = useMemo(() => {
    return hourlySpendingBreakdown.map((d) => d.total);
  }, [hourlySpendingBreakdown]);

  return (
    <BarChart
      labels={labels}
      values={values}
      isCurrencyValue={true}
      dataLabel="Spend by hour"
      isVerticalChart={false}
      useSingleColor={true}
    />
  );
}

export interface HourlySpendingBreakdownChartProps {
  hourlySpendingBreakdown: HourlySpendingResult[];
}
