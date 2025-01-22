import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GameResultsCard = () => {
  const navigate = useNavigate();
  const [latestGameRecord, setLatestGameRecord] = useState(null);
  const MAX_VISIBLE_LOGS = 2; // 표시할 최대 행 수

  useEffect(() => {
    // API 데이터 가져오기
    const fetchGameRecords = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/stocks/trade-logs/",
          {
            withCredentials: true, // 쿠키 포함 설정
          }
        );

        // 거래 내역이 있는 게임만 필터링
        const filteredGameLogs = response.data.trade_logs.filter(
          (game) => game.logs && game.logs.length > 0
        );

        // 가장 최신의 게임 기록 하나만 선택
        if (filteredGameLogs.length > 0) {
          const latestGame = filteredGameLogs[filteredGameLogs.length - 1];
          const formattedRecord = {
            date: new Date(latestGame.logs[0]?.date || "").toLocaleDateString(),
            logs: latestGame.logs
              .slice(0, MAX_VISIBLE_LOGS) // MAX_VISIBLE_LOGS만큼 자르기
              .map((log) => ({
                date: new Date(log.date || "").toLocaleDateString(),
                type: log.is_buy ? "매수" : "매도",
                price: log.price,
                quantity: log.quantity,
                total: log.price * log.quantity,
              })),
          };
          setLatestGameRecord(formattedRecord);
        }
      } catch (error) {
        console.error("Failed to fetch game records:", error);
      }
    };

    fetchGameRecords();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h3 className="text-lg text-black font-semibold mb-4">최신 게임 거래 내역</h3>
      

      {latestGameRecord ? (
        <div>
          <h4 className="text-md font-semibold mb-2">게임 날짜: {latestGameRecord.date}</h4>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">거래 날짜</th>
                <th className="p-2 border border-gray-300">거래 유형</th>
                <th className="p-2 border border-gray-300">거래 가격</th>
                <th className="p-2 border border-gray-300">거래 수량</th>
                <th className="p-2 border border-gray-300">총 거래 금액</th>
              </tr>
            </thead>
            <tbody>
              {latestGameRecord.logs.map((log, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border border-gray-300">{log.date}</td>
                  <td className="p-2 border border-gray-300">{log.type}</td>
                  <td className="p-2 border border-gray-300">{log.price.toLocaleString()}원</td>
                  <td className="p-2 border border-gray-300">{log.quantity.toLocaleString()}</td>
                  <td className="p-2 border border-gray-300">{log.total.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">거래 내역이 없습니다.</p>
      )}

      <button
        className="mt-3 w-full bg-blue-500 text-white py-1 rounded-lg"
        onClick={() => navigate("/result")}
      >
        전체 기록 보기
      </button>
    </div>
  );
};

export default GameResultsCard;