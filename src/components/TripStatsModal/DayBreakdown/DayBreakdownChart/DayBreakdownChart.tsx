import { DayBreakdownChartProps } from "./DayBreakdownChart.types";
import { useMemo } from "react";
import LineChart from "@/components/Charts/LineChart/LineChart";
import format from "date-fns/format";

export default function DayBreakdownChart({
  dailyCostBreakdown,
}: DayBreakdownChartProps) {
  const labels = useMemo(() => {
    return dailyCostBreakdown.map((d) =>
      format(new Date(d.localDate), "MMM dd")
    );
  }, [dailyCostBreakdown]);

  const values = useMemo(() => {
    return dailyCostBreakdown.map((d) => d.euroTotal);
  }, [dailyCostBreakdown]);

  return (
    <LineChart
      labels={labels}
      values={values}
      isCurrencyValue={true}
      dataLabel="Daily spent"
    />
  );
}
