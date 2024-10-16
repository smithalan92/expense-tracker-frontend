import { CategoryBreakdownResult } from "@/api";
import DoughnutChart from "@/components/widgets/Charts/DoughnutChart";
import { useMemo } from "react";

export default function CategoryBreakDownPieChart({
  categoryBreakdown,
}: CategoryBreakDownPieChartProps) {
  const labels = useMemo(() => {
    return categoryBreakdown.map((c) => c.categoryName);
  }, [categoryBreakdown]);

  const values = useMemo(() => {
    return categoryBreakdown.map((c) => c.totalEuroAmount);
  }, [categoryBreakdown]);

  return (
    <div className="flex items-center justify-center">
      <DoughnutChart
        labels={labels}
        values={values}
        isCurrencyValue={true}
        dataLabel="Spent"
      />
    </div>
  );
}

export interface CategoryBreakDownPieChartProps {
  categoryBreakdown: CategoryBreakdownResult[];
}
