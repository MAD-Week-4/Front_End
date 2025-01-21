import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const CandleStick = ({ selectedStock }) => {
  const [chartData, setChartData] = useState([]);

  // ✅ selectedStock이 변경될 때마다 최신 데이터 반영
  useEffect(() => {
    if (selectedStock && selectedStock.data) {
      setChartData(selectedStock.data);
    }
  }, [selectedStock]);

  if (!selectedStock) return <p className="text-gray-400">종목을 선택하세요.</p>;

  // ✅ 차트 데이터 변환 (가장 최신 데이터를 반영)
  const series = [
    {
      data: chartData.map((price) => ({
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
      categories: chartData.map((item) => item.date),
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
