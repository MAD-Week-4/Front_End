import React from "react";
import ReactApexChart from "react-apexcharts";

const AiProfitChart = () => {
  const aiSeries = [
    {
      name: "AI 수익률",
      data: [0, 2, 4, 3, 6, 8, 12, 10, 15],
    },
  ];

  const aiOptions = {
    theme: {
      mode: "dark",
    },
    chart: {
      type: "line",
      height: 200,
      background: "transparent",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: [
        "1월 1주",
        "1월 2주",
        "1월 3주",
        "1월 4주",
        "2월 1주",
        "2월 2주",
        "2월 3주",
        "2월 4주",
        "3월 1주",
      ],
      labels: { show: true },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  return (
    <div className="bg-gray-700 p-3 rounded">
      <h3 className="text-md font-semibold mb-2">경쟁 (AI 수익률)</h3>
      <p className="text-sm text-gray-300 mb-3">
        이곳에 AI 수익률 그래프를 표시합니다 (더미 데이터).
      </p>
      <div className="bg-gray-900 rounded p-2">
        <ReactApexChart type="line" series={aiSeries} options={aiOptions} height={200} />
      </div>
    </div>
  );
};

export default AiProfitChart;
