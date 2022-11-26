export interface BarChartProps {
  labels: (string | number)[];
  values: (string | number)[];
  isCurrencyValue: boolean;
  isVerticalChart: boolean;
  dataLabel: string;
}
