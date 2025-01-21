import React, { useEffect, useState } from "react";
import axios from "axios";

const GameResultsPage = () => {
  const [gameTradeLogs, setGameTradeLogs] = useState([]);

  useEffect(() => {
    // API 호출: 게임별 거래 내역 가져오기
    const fetchGameTradeLogs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/stocks/trade-logs/", {
          withCredentials: true, // 인증 포함 (ex: 쿠키 인증)
        });

        // 거래 내역이 있는 게임만 필터링 후 최신 순으로 정렬
        const filteredGames = response.data.trade_logs
          .filter((game) => game.logs && game.logs.length > 0)
          .sort((a, b) => b.game_id - a.game_id); // 최신 순 정렬 (game_id 내림차순)

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
            <h2 className="text-lg font-semibold mb-2">
              게임 이름: {game.game_name} (시작일: {new Date(game.game_start_data).toLocaleDateString()})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-700 text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3 border border-gray-700">거래 날짜</th>
                    <th className="p-3 border border-gray-700">거래 유형</th>
                    <th className="p-3 border border-gray-700">거래 가격</th>
                    <th className="p-3 border border-gray-700">거래 수량</th>
                    <th className="p-3 border border-gray-700">총 거래 금액</th>
                  </tr>
                </thead>
                <tbody>
                  {game.logs.map((log, logIndex) => (
                    <tr key={logIndex} className="bg-gray-800 odd:bg-gray-700">
                      <td className="p-3 border border-gray-700">{new Date(log.date).toLocaleDateString()}</td>
                      {/* 거래 유형 색상 변경: 매수(빨간색), 매도(파란색) */}
                      <td
                        className={`p-3 border border-gray-700 font-semibold ${
                          log.is_buy ? "text-red-500" : "text-blue-500"
                        }`}
                      >
                        {log.is_buy ? "매수" : "매도"}
                      </td>
                      <td className="p-3 border border-gray-700">{log.price.toLocaleString()}원</td>
                      <td className="p-3 border border-gray-700">{log.quantity.toLocaleString()}</td>
                      <td className="p-3 border border-gray-700">{(log.price * log.quantity).toLocaleString()}원</td>
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

export default GameResultsPage;