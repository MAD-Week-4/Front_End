import React from "react";
import ReactApexChart from "react-apexcharts";

const StockChart = ({ stock }) => {
  if (!stock) return <p className="text-gray-400">종목을 선택하세요.</p>;

  const chartData = {
    "한화에어로스페이스": [380000, 385000, 382000, 390000, 395000, 398000],
    "삼성전자": [62000, 63000, 62800, 63500, 64000, 64500],
    "카카오": [54000, 55000, 54800, 55500, 56000, 56200],
  };

  const series = [{ name: stock.name, data: chartData[stock.name] || [] }];

  const options = {
    chart: { type: "line", background: "transparent", toolbar: { show: false } },
    stroke: { curve: "smooth" },
    xaxis: { categories: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"] },
    yaxis: { labels: { formatter: (val) => `${val.toLocaleString()}원` } },
    tooltip: { y: { formatter: (val) => `${val.toLocaleString()}원` } },
  };

  return (
    <div className="bg-gray-700 p-3 rounded">
      <h3 className="text-md font-semibold mb-2">{stock.name} 주가 차트</h3>
      <ReactApexChart type="line" series={series} options={options} height={200} />
    </div>
  );
};

export default StockChart;
