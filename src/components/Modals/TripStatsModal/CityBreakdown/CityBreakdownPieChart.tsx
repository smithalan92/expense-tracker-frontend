import { CityBreakdownResult } from "@/api";
import DoughnutChart from "@/components/widgets/Charts/DoughnutChart";
import { useMemo } from "react";

export default function CityBreakdownPieChart({
  cityBreakdown,
}: CityBreakdownPieChartProps) {
  const labels = useMemo(() => {
    return cityBreakdown.map((c) => c.name);
  }, [cityBreakdown]);

  const values = useMemo(() => {
    return cityBreakdown.map((c) => c.euroTotal);
  }, [cityBreakdown]);

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

export interface CityBreakdownPieChartProps {
  cityBreakdown: CityBreakdownResult[];
}
