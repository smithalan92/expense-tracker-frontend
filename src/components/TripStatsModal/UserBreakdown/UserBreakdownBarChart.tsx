import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { UserBreakdownBarChartProps } from "./UserBreakdownBarChart.types";

function makeChartData(labels: string[], values: (string | number)[]) {
  return {
    labels,
    datasets: [
      {
        label: "Spent",
        data: values,
        backgroundColor: ["rgba(255, 225, 25, 0.6)", "rgba(0, 130, 200, 0.6)"],
      },
    ],
  };
}

const CHART_OPTIONS = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || "";

          if (label) {
            label += ": ";
          }
          console.log(context);
          if (context.parsed !== null) {
            label += new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EUR",
            }).format(context.parsed.x);
          }
          return label;
        },
      },
    },
    legend: {
      display: false,
    },
  },
};

export default function UserBreakdownBarChart({
  userBreakdown,
}: UserBreakdownBarChartProps) {
  const labels = useMemo(() => {
    return userBreakdown.map((u) => u.userFirstName);
  }, [userBreakdown]);

  const values = useMemo(() => {
    return userBreakdown.map((u) => u.totalEuroAmount);
  }, [userBreakdown]);

  const chartData = useMemo(() => {
    return makeChartData(labels, values);
  }, [labels, values]);

  return (
    <div className="flex items-center justify-center">
      <Bar data={chartData} options={CHART_OPTIONS} />
    </div>
  );
}
