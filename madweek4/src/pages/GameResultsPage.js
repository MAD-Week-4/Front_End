import React, { useState } from "react";

const GameResultsPage = () => {
  const [sortOrder, setSortOrder] = useState("desc");

  // 예제 데이터 (실제 데이터는 API에서 가져오거나 상태 저장)
  const [gameRecords, setGameRecords] = useState([
    { date: "2025-01-15", userReturn: 12.5, aiReturn: 10.3 },
    { date: "2025-01-14", userReturn: -2.3, aiReturn: 3.1 },
    { date: "2025-01-13", userReturn: 7.8, aiReturn: 5.6 },
    { date: "2025-01-12", userReturn: -4.2, aiReturn: -1.9 },
    { date: "2025-01-11", userReturn: 15.0, aiReturn: 12.8 },
  ]);

  // 승리 여부 계산
  const processedRecords = gameRecords.map((record) => {
    const difference = record.userReturn - record.aiReturn;
    const winner = difference > 0 ? "사용자 승리" : difference < 0 ? "AI 승리" : "무승부";
    return { ...record, difference, winner };
  });

  // 정렬 함수 (수익률 차이 기준)
  const sortedRecords = [...processedRecords].sort((a, b) =>
    sortOrder === "asc" ? a.difference - b.difference : b.difference - a.difference
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">AI vs 사용자 수익률 게임 기록</h1>
      <div className="flex justify-between items-center mb-4">
        <span>총 게임 횟수: {gameRecords.length}</span>
        <button
          className="px-4 py-2 bg-blue-600 rounded-lg"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "수익률 차이 ↓" : "수익률 차이 ↑"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 border border-gray-700">날짜</th>
              <th className="p-3 border border-gray-700">사용자 수익률</th>
              <th className="p-3 border border-gray-700">AI 수익률</th>
              <th className="p-3 border border-gray-700">수익률 차이</th>
              <th className="p-3 border border-gray-700">결과</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record, index) => (
              <tr key={index} className="bg-gray-800 odd:bg-gray-700">
                <td className="p-3 border border-gray-700">{record.date}</td>
                <td className={`p-3 border border-gray-700 ${record.userReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {record.userReturn}%
                </td>
                <td className={`p-3 border border-gray-700 ${record.aiReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {record.aiReturn}%
                </td>
                <td className={`p-3 border border-gray-700 ${record.difference >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {record.difference.toFixed(2)}%
                </td>
                <td className={`p-3 border border-gray-700 font-semibold ${record.winner === "사용자 승리" ? "text-blue-400" : "text-red-400"}`}>
                  {record.winner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameResultsPage;
