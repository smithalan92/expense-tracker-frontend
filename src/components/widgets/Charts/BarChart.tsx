import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { makeBarChartOptions, makeChartData } from "./utils";

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
    [labels, values, dataLabel, useSingleColor]
  );
  const options = useMemo(
    () => makeBarChartOptions(isCurrencyValue, isVerticalChart),
    [isCurrencyValue, isVerticalChart]
  );

  return useMemo(() => <Bar data={data} options={options} />, [data, options]);
}

export interface BarChartProps {
  labels: (string | number)[];
  values: (string | number)[];
  isCurrencyValue: boolean;
  isVerticalChart: boolean;
  dataLabel: string;
  useSingleColor?: boolean;
}
