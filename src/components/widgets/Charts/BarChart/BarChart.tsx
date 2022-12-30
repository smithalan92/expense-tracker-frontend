import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { makeChartData, makeBarChartOptions } from "../utils";
import { BarChartProps } from "./BarChart.types";

export default function BarChart({
  labels,
  values,
  isCurrencyValue,
  isVerticalChart,
  dataLabel,
  useSingleColor,
}: BarChartProps) {
  const data = useMemo(
    () => makeChartData(labels, values, dataLabel, useSingleColor),
    [labels, values, dataLabel]
  );
  const options = useMemo(
    () => makeBarChartOptions(isCurrencyValue, isVerticalChart),
    [isCurrencyValue, isVerticalChart]
  );

  return useMemo(() => <Bar data={data} options={options} />, [data, options]);
}
