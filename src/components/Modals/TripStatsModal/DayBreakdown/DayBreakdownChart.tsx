import { DailyCostBreakdownResult } from "@/api";
import LineChart from "@/components/widgets/Charts/LineChart";
import format from "date-fns/format";
import { useMemo } from "react";

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

export interface DayBreakdownChartProps {
  dailyCostBreakdown: DailyCostBreakdownResult[];
}
