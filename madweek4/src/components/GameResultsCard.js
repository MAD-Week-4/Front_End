import React from "react";
import { useNavigate } from "react-router-dom";

const GameResultsCard = () => {
  const navigate = useNavigate();

  // 최근 게임 기록 (실제 데이터는 API 연동 필요)
  const gameRecords = [
    { date: "2025-01-15", userReturn: 12.5, aiReturn: 10.3 },
    { date: "2025-01-14", userReturn: -2.3, aiReturn: 3.1 },
    { date: "2025-01-13", userReturn: 7.8, aiReturn: 5.6 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-semibold mb-2">최근 게임 결과</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-600">
            <th className="p-2">날짜</th>
            <th className="p-2">사용자</th>
            <th className="p-2">AI</th>
            <th className="p-2">승자</th>
          </tr>
        </thead>
        <tbody>
          {gameRecords.map((record, index) => {
            const winner = record.userReturn > record.aiReturn ? "사용자" : "AI";
            return (
              <tr key={index} className="border-t text-center">
                <td className="p-2">{record.date}</td>
                <td className={`p-2 ${record.userReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {record.userReturn}%
                </td>
                <td className={`p-2 ${record.aiReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {record.aiReturn}%
                </td>
                <td className={`p-2 font-bold ${winner === "사용자" ? "text-blue-600" : "text-red-600"}`}>
                  {winner}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
