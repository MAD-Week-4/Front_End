import React from "react";
import ReactApexChart from "react-apexcharts";

const CandleStick = ({ selectedStock }) => {
  if (!selectedStock) return <p className="text-gray-400">종목을 선택하세요.</p>;

  const stockData = selectedStock.data;

  // 캔들스틱 차트 데이터 변환
  const series = [
    {
      data: stockData.map((price) => ({
        x: price.date,
        y: [price.open_price, price.upper_limit, price.lower_limit, price.close_price],
      })),
    },
  ];

  const options = {
    theme: {
      mode: "dark",
    },
    chart: {
      height: 400,
      background: "transparent",
    },
    grid: {
      show: false,
    },
    plotOptions: {
      candlestick: {
        wick: {
          useFillColor: true,
        },
      },
    },
    xaxis: {
      labels: {
        show: true,
      },
      type: "datetime",
      categories: stockData.map((item) => item.date),
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val.toLocaleString()}원`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()}원`,
      },
    },
  };

  return (
    <div className="w-full h-auto bg-gray-700 p-3 rounded">
      <h3 className="text-md font-semibold mb-2">{selectedStock.stock} 주가 차트</h3>
      <ReactApexChart type="candlestick" series={series} options={options} height={400} />
    </div>
  );
};

export default CandleStick;
