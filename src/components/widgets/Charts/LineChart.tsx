import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { makeLineChartData, makeLineChartOptions } from "./utils";

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

  return useMemo(
    () => (
      <div className="max-h-[500px]">
        <Line data={data} options={options} />
      </div>
    ),
    [data, options]
  );
}

export interface LineChartProps {
  labels: (string | number)[];
  values: (string | number)[];
  isCurrencyValue: boolean;
  dataLabel: string;
}
