import { useEffect, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { Box } from "@mui/material";

type MovimentationPerMonth = {
  month: number;
  total: {
    out: number;
    in: number;
  };
};

type Props = {
  movimentation: MovimentationPerMonth[];
};

export const CashFlowChart = ({ movimentation }: Props) => {
  const [ChartComponent, setChartComponent] =
    useState<null | React.ComponentType<any>>(null);

  useEffect(() => {
    let mounted = true;

    import("react-apexcharts")
      .then((mod) => {
        if (mounted) {
          setChartComponent(() => mod.default);
        }
      })
      .catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  if (!ChartComponent) {
    return (
      <div className="h-87.5 flex items-center justify-center">
        Carregando gráfico...
      </div>
    );
  }

  const sales = Array(12).fill(0);
  const expenses = Array(12).fill(0);

  movimentation.forEach((item) => {
    const index = item.month - 1;
    if (index < 0 || index > 11) return;
    sales[index] = Number(item.total.in) || 0;
    expenses[index] = Number(-item.total.out) || 0;
    console.log(item);
  });

  const series = [
    { name: "Entradas", data: sales },
    { name: "Saídas", data: expenses },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 420, // gráfico maior
      toolbar: { show: false },
      background: "#FFFFFF",
    },

    plotOptions: {
      bar: {
        columnWidth: "60%", // barras mais largas
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },

    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.4,
        gradientToColors: ["#16A34A", "#4ADE80"], // verde gradient
        inverseColors: false,
        opacityFrom: 0.95,
        opacityTo: 0.95,
        stops: [0, 100],
      },
    },

    colors: ["#15803D", "#22C55E"],

    xaxis: {
      categories: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      labels: {
        style: {
          colors: "#374151",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
    },

    yaxis: {
      labels: {
        style: {
          colors: "#374151",
          fontSize: "13px",
        },
        formatter: (val) =>
          `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`,
      },
    },

    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      position: "top",
      fontSize: "14px",
      labels: {
        colors: "#111827",
      },
    },

    tooltip: {
      theme: "light",
      y: {
        formatter: (val) =>
          `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        width: "1000px",
      }}
    >
      <ChartComponent
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </Box>
  );
};
