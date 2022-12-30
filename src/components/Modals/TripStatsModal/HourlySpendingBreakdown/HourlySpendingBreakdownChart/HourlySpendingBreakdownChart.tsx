import { HourlySpendingBreakdownChartProps } from "./HourlySpendingBreakdownChart.types";
import { useMemo } from "react";
import BarChart from "@/components/widgets/Charts/BarChart/BarChart";

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
