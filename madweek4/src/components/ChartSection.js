import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
import GameResultsCard from "./GameResultsCard";

const ChartSection = () => {
  const [gameProfitData, setGameProfitData] = useState([]);

  useEffect(() => {
    // API 통신으로 게임별 수익률 가져오기
    const fetchGameProfitData = async () => {
      try {
        // API 호출
        const response = await axios.get("http://localhost:8000/api/v1/stocks/trade-logs/", {
          withCredentials: true,
        });

        // 로그가 있는 게임만 수익률 데이터 생성
        const profitData = response.data.trade_logs
          .filter((game) => game.logs && game.logs.length > 0) // 로그가 없는 게임 제외
          .map((game) => ({
            id: game.game_id, // 게임 ID로 표시
            profit: parseFloat(game.profit_rate.toFixed(2)), // 수익률 소수점 2자리 고정
          }));

        setGameProfitData(profitData);
      } catch (error) {
        console.error("게임 수익률 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchGameProfitData();
  }, []);

  return (
    <div className="py-16 px-8 bg-black text-white">
      <h2 className="text-2xl font-bold text-center mb-6">실시간 차트</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 첫 번째 카드: GameResultsCard */}
        <GameResultsCard />

        {/* 첫 번째 차트 유지 */}
        <div className="p-4 border rounded-lg shadow-md bg-gray-50">
          <h3 className="text-lg text-black font-semibold">첫 번째 차트</h3>
          {/* 가상 데이터 (기존 chartData 첫 번째 데이터 사용) */}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={Array.from({ length: 10 }, (_, i) => ({ name: `Day ${i + 1}`, value: Math.random() * 100 }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🟢 두 번째 차트: 게임 ID 별 수익률 BarChart */}
        <div className="p-4 border rounded-lg shadow-md bg-gray-50">
          <h3 className="text-lg text-black font-semibold">게임 ID 별 수익률</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gameProfitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" /> {/* 게임 ID를 X축의 키로 사용 */}
              <YAxis />
              <Tooltip />
              <Bar dataKey="profit" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;