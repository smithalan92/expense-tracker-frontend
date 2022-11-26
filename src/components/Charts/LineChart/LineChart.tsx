import { LineChartProps } from "./LineChart.types";
import { Line } from "react-chartjs-2";
import { useMemo } from "react";
import { makeLineChartData, makeLineChartOptions } from "../utils";

export default function LineChart({
  labels,
  values,
  isCurrencyValue,
  dataLabel,
}: LineChartProps) {
  const data = useMemo(
    () => makeLineChartData(labels, values, dataLabel, true),
    [labels, values, dataLabel]
  );
  const options = useMemo(
    () => makeLineChartOptions(isCurrencyValue),
    [isCurrencyValue]
  );

  return useMemo(() => <Line data={data} options={options} />, [data, options]);
}
