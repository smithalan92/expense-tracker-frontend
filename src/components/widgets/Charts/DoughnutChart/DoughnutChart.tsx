import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { makeDoughnutChartOptions, makeChartData } from "../utils";
import { DoughnutChartProps } from "./DoughnutChart.types";

export default function DoughnutChart({
  labels,
  values,
  isCurrencyValue,
  dataLabel,
}: DoughnutChartProps) {
  const data = useMemo(
    () => makeChartData(labels, values, dataLabel),
    [labels, values, dataLabel]
  );
  const options = useMemo(
    () => makeDoughnutChartOptions(isCurrencyValue),
    [isCurrencyValue]
  );

  return useMemo(
    () => (
      <div className="max-h-[500px]">
        <Doughnut data={data} options={options} />
      </div>
    ),
    [data, options]
  );
}
