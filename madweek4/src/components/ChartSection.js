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
  Legend,
  Bar,
  ComposedChart,
} from "recharts";
import axios from "axios";
import GameResultsCard from "./GameResultsCard";

const ChartSection = () => {
  const [gameProfitData, setGameProfitData] = useState([]);
  const [aiProfitData, setAiProfitData] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [latestGameData, setLatestGameData] = useState([]);

  useEffect(() => {
    const fetchGameProfitData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/stocks/trade-logs/",
          {
            withCredentials: true,
          }
        );

        const aiResponse = await axios.get(
          "http://localhost:8000/api/v1/stocks/ai-trade-logs/",
          {
            withCredentials: true,
          }
        );

        const profitData = response.data.trade_logs
          .filter((game) => game.logs && game.logs.length > 0)
          .map((game) => ({
            id: game.game_id,
            profit: parseFloat(game.profit_rate.toFixed(2)),
          }));

        const aiProfit = aiResponse.data.ai_trade_logs
          .filter((game) => game.logs && game.logs.length > 0)
          .map((game) => ({
            id: game.game_id,
            aiProfit: parseFloat(game.ai_profit_rate.toFixed(2)),
          }));

        // 데이터를 병합
        const mergedData = profitData.map((profitItem) => {
        const aiItem = aiProfit.find((item) => item.id === profitItem.id) || {}; // 같은 id를 가진 항목 찾기
        return {
          id: profitItem.id,
          profit: profitItem.profit,
          aiProfit: aiItem.aiProfit || 0, // aiProfit이 없으면 기본값 0
        };});

      // 추가적으로 aiProfit에만 있는 데이터 병합
      aiProfit.forEach((aiItem) => {
        if (!mergedData.some((mergedItem) => mergedItem.id === aiItem.id)) {
          mergedData.push({
            id: aiItem.id,
            profit: 0, // profit 데이터는 없으므로 기본값 0
            aiProfit: aiItem.aiProfit,
          });
        }});
      mergedData.sort((a, b) => a.id - b.id);

        const latestGame = response.data.trade_logs
          .filter((game) => game.logs && game.logs.length > 0) // 로그가 있는 데이터만 필터링
          .reduce((prev, current) =>
            current.game_id > (prev?.game_id || 0) ? current : prev, null); // 가장 최신 게임 추출

        if (latestGame) {
          const formattedLatestGame = latestGame.logs.map((log) => ({
            date: new Date(log.date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              hour12: false,
            }),
            profit: parseFloat(log.profit.toFixed(2)), // 수익률 정리
          }));
          setLatestGameData(formattedLatestGame);
        } else {
          console.warn("데이터에 로그가 있는 게임이 없습니다.");
          setLatestGameData([]); // 기본 빈 데이터 설정
        }

        console.log(latestGameData);


        setGameProfitData(profitData);
        setAiProfitData(aiProfit);
        setMergedData(mergedData); // 병합된 데이터를 설정
      } catch (error) {
        console.error("게임 수익률 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchGameProfitData();
  }, []);

  return (
    <div className="py-16 px-8 bg-black text-white">
      <h2 className="text-2xl font-bold text-center mb-6">실시간 차트</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* 첫 번째 카드 */}
        <GameResultsCard/>

        {/* First Placeholder Chart */}
        <div className="p-4 border border-black rounded-lg shadow-md bg-gray-800 w-full flex justify-center">
          <div className="w-full max-w-4xl">
            <h3 className="text-lg text-white font-semibold text-center">최근 게임 수익률</h3>
            <ResponsiveContainer width="100%" height={300} margin={{ top: 20, right: 0, bottom: 20, left: 0 }}>
              <LineChart margin={{ top: 20, right: 50, bottom: 20, left: 0 }}
                  data={latestGameData}
              >
                <XAxis stroke="white" dataKey="date"/>
                <YAxis stroke="white"/>
                <Tooltip
                    contentStyle={{
                      backgroundColor: "#333", // 팝업 배경색
                      borderRadius: "8px", // 둥근 모서리 적용
                      border: "1px solid #555", // 테두리 스타일
                      color: "#fff", // 글자 색상
                    }}
                    itemStyle={{
                      color: "#f0f0f0", // 항목 텍스트 색상
                      fontWeight: "bold", // 텍스트 굵기
                    }}
                    labelStyle={{
                      color: "#fff", // 레이블 텍스트 색상
                      fontSize: "14px", // 레이블 글꼴 크기
                      fontWeight: "700", // 레이블 굵기
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#8884d8"
                    strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Combined Chart */}
        <div className="p-4 border border-black rounded-lg shadow-md bg-gray-800 w-full flex justify-center">
          <div className="w-full max-w-4xl"> {/* 차트 중앙 정렬을 위해 최대 폭 제한 */}
            <h3 className="text-lg text-white font-semibold text-center">게임 별 수익률</h3>
            <ResponsiveContainer
                width="100%"
                height={300}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                padding={{ top: 0, right: 0, bottom: 0, left: 0 }} >
              <ComposedChart data={mergedData} margin={{ top: 20, right: 50, bottom: 20, left: 0 }}>
                <CartesianGrid stroke="white" strokeDasharray="3 3" strokeOpacity={0.5}/>
                <XAxis stroke="white" dataKey="id"/>
                <YAxis stroke="white"/>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#333", // 팝업 배경색
                        borderRadius: "8px", // 둥근 모서리 적용
                        border: "1px solid #555", // 테두리 스타일
                        color: "#fff", // 글자 색상
                      }}
                      itemStyle={{
                        color: "#f0f0f0", // 항목 텍스트 색상
                        fontWeight: "bold", // 텍스트 굵기
                      }}
                      labelStyle={{
                        color: "#fff", // 레이블 텍스트 색상
                        fontSize: "14px", // 레이블 글꼴 크기
                        fontWeight: "700", // 레이블 굵기
                      }}
                />

                <Legend
                    verticalAlign="top"
                    height={36}
                />

                <Line
                    type="linear"
                    dataKey="profit" // AI 수익률
                    name="내 수익률"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                />


                {/* Line Chart */}
                <Line
                    type="linear"
                    dataKey="aiProfit" // AI 수익률
                    name="AI 수익률"
                    stroke="#FF5733"
                    strokeWidth={2}
                    dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;