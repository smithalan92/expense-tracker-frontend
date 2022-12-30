const COLOR_OPTIONS = [
  "rgba(230, 25, 75, 0.6)",
  "rgba(60, 180, 75, 0.6)",
  "rgba(255, 225, 25, 0.6)",
  "rgba(0, 130, 200, 0.6)",
  "rgba(245, 130, 48, 0.6)",
  "rgba(145, 30, 180, 0.6)",
  "rgba(70, 240, 240, 0.6)",
  "rgba(240, 50, 230, 0.6)",
  "rgba(210, 245, 60, 0.6)",
  "rgba(250, 190, 212, 0.6)",
  "rgba(0, 128, 128, 0.6)",
  "rgba(220, 190, 255, 0.6)",
  "rgba(170, 110, 40, 0.6)",
  "rgba(255, 250, 200, 0.6)",
  "rgba(128, 0, 0, 0.6)",
  "rgba(170, 255, 195, 0.6)",
  "rgba(128, 128, 0, 0.6)",
  "rgba(255, 215, 180, 0.6)",
  "rgba(0, 0, 128, 0.6)",
  "rgba(128, 128, 128, 0.6)",
  "rgba(255, 255, 255, 0.6)",
  "rgba(0, 0, 0, 0.6)",
];

export function makeChartData(
  labels: (string | number)[],
  values: (string | number)[],
  dataTitle: string,
  useSingleColour?: boolean
) {
  return {
    labels,
    datasets: [
      {
        label: dataTitle,
        data: values,
        backgroundColor: useSingleColour ? COLOR_OPTIONS[3] : COLOR_OPTIONS,
        borderWidth: 1,
      },
    ],
  };
}

export function makeLineChartData(
  labels: (string | number)[],
  values: (string | number)[],
  dataTitle: string,
  isAreaChart: boolean
) {
  return {
    labels,
    datasets: [
      {
        fill: isAreaChart,
        label: dataTitle,
        data: values,
        backgroundColor: COLOR_OPTIONS[3],
        borderColor: "rgba(255, 255, 255)",
        borderWidth: 1,
      },
    ],
  };
}

export function makeDoughnutChartOptions(isCurrencyValue: boolean) {
  return {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              if (isCurrencyValue) {
                label += new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EUR",
                }).format(context.parsed);
              } else {
                label += context.parsed;
              }
            }
            return label;
          },
        },
      },
      legend: {
        display: true,
        position: "bottom" as const,
      },
    },
  };
}

export function makeBarChartOptions(
  isCurrencyValue: boolean,
  isVertialChart: boolean
) {
  return {
    indexAxis: isVertialChart ? ("y" as const) : ("x" as const),
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
            if (context.parsed !== null) {
              const value = isVertialChart
                ? context.parsed.x
                : context.parsed.y;
              if (isCurrencyValue) {
                label += new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EUR",
                }).format(value);
              } else {
                label += value;
              }
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
}

export function makeLineChartOptions(isCurrencyValue: boolean) {
  return {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              const value = context.parsed.y;
              if (isCurrencyValue) {
                label += new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "EUR",
                }).format(value);
              } else {
                label += value;
              }
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
}
