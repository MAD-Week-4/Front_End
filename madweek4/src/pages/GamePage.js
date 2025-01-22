import React, { useEffect, useState } from "react";
import axios from "axios";

const GamePage = () => {
  const [gameTradeLogs, setGameTradeLogs] = useState([]);

  useEffect(() => {
    // API 호출: 게임별 거래 내역 가져오기
    const fetchGameTradeLogs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/stocks/trade-logs/", {
          withCredentials: true, // 인증 포함 (ex: 쿠키 인증)
        });

        const filteredGames = response.data.trade_logs
          .filter((game) => game.logs && game.logs.length > 0) // 거래 내역이 없는 게임은 제외
          .map((game) => ({
            ...game,
            // 각 게임의 거래 내역을 created_at 기준으로 최신순 정렬
            logs: game.logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
          }))
          // 게임 전체를 게임 ID 기준으로 내림차순 정렬
          .sort((a, b) => b.game_id - a.game_id);

        // 상태 업데이트
        setGameTradeLogs(filteredGames);
      } catch (error) {
        console.error("Failed to fetch trade logs:", error);
      }
    };

    fetchGameTradeLogs();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">유저 게임별 거래 내역</h1>

      {gameTradeLogs.length === 0 ? (
        <p className="text-center text-gray-400">거래 내역이 없습니다.</p>
      ) : (
        gameTradeLogs.map((game) => (
          <div key={game.game_id} className="mb-8">
            {/* 게임 이름과 수익률 */}
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-4">
              <span>게임 이름: {game.game_name}</span>
              <span
                  className={`font-bold ${
                      game.profit_rate >= 0 ? "text-red-500" : "text-blue-500"
                  }`}
              >
                ({game.profit_rate >= 0 ? "+" : ""}{parseFloat(game.profit_rate).toFixed(2)}%)
              </span>
              <span className="text-sm text-gray-400">
                (시작일: {new Date(game.game_start_data).toLocaleDateString()})
              </span>
              <span className="text-xs text-gray-400">(ID: {game.game_id})</span> {/* 게임 ID 추가 */}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-700 text-left">
                <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 border border-gray-700">거래 날짜</th>
                  <th className="p-3 border border-gray-700">거래 유형</th>
                  <th className="p-3 border border-gray-700">종목</th>
                  <th className="p-3 border border-gray-700">거래 가격</th>
                  <th className="p-3 border border-gray-700">거래 수량</th>
                  <th className="p-3 border border-gray-700">총 거래 금액</th>
                  <th className="p-3 border border-gray-700">수익률</th>
                </tr>
                </thead>
                <tbody>
                {game.logs.map((log, logIndex) => (
                    <tr key={logIndex} className="bg-gray-800 odd:bg-gray-700">
                      <td className="p-3 border border-gray-700">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                      {/* 거래 유형 색상 변경: 매수(빨간색), 매도(파란색) */}
                      <td
                          className={`p-3 border border-gray-700 font-semibold ${
                              log.is_buy ? "text-red-500" : "text-blue-500"
                          }`}
                      >
                        {log.is_buy ? "매수" : "매도"}
                      </td>
                      <td className="p-3 border border-gray-700">{log.stock.name}</td>
                      <td className="p-3 border border-gray-700">{log.price.toLocaleString()}원</td>
                      <td className="p-3 border border-gray-700">{log.quantity.toLocaleString()}</td>
                      <td className="p-3 border border-gray-700">
                        {(log.price * log.quantity).toLocaleString()}원
                      </td>
                      <td
                          className={`p-3 border border-gray-700 font-semibold ${
                              log.profit >= 0 ? "text-red-500" : "text-blue-500"
                          }`}
                      >
                          {log.profit.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GamePage;