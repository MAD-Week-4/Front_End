import React from "react";
import StockList from "./StockList";
import AiProfitChart from "./AiProfitChart";

const AiPerformance = ({ onStockSelect }) => {
  const dummyStocks = [
    { name: "한화에어로스페이스", price: 382500, change: "-2.9%" },
    { name: "삼성전자", price: 63000, change: "+1.5%" },
    { name: "카카오", price: 55000, change: "+0.3%" },
  ];

  return (
    <div>
      <StockList stocks={dummyStocks} onStockSelect={(stock) => {
        console.log("Updating selectedStock:", stock); // ✅ 상태 변경 확인 로그
        onStockSelect(stock);
      }} />
      <AiProfitChart />
    </div>
  );
};

export default AiPerformance;

