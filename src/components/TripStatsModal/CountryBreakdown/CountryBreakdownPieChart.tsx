import DoughnutChart from "@/components/Charts/DoughnutChart/DoughnutChart";
import { useMemo } from "react";
import { CountryBreakdownPieChartProps } from "./CountryBreakdownPieChart.types";

export default function CountryBreakdownPieChart({
  countryBreakdown,
}: CountryBreakdownPieChartProps) {
  const labels = useMemo(() => {
    return countryBreakdown.map((c) => c.name);
  }, [countryBreakdown]);

  const values = useMemo(() => {
    return countryBreakdown.map((c) => c.euroTotal);
  }, [countryBreakdown]);

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
