import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import chartData from "../data/chartData"; // ✅ components 폴더 기준으로 한 단계 위로 이동
import GameResultsCard from "./GameResultsCard";

const ChartSection = () => {
  return (
    <div className="py-16 px-8 bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">실시간 차트</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🆕 첫 번째 카드로 게임 결과 추가 */}
        <GameResultsCard />

        {/* 🟢 차트는 기존 그대로 유지 (2개만 표시) */}
        {chartData.slice(0, 2).map((data, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md bg-gray-50">
            <h3 className="text-lg font-semibold">{data.title}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.values}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartSection;
