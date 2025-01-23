import React, { useState, useEffect } from "react";

const StockList = ({ stocks = [], onStockSelect }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const stocksPerPage = 3; // 한 페이지당 3개만 표시

  useEffect(() => {
    setCurrentPage(0); // ✅ 데이터가 업데이트되면 첫 페이지로 이동
  }, [stocks]);

  // 현재 페이지의 종목만 보여주기
  const paginatedStocks = stocks.slice(currentPage * stocksPerPage, (currentPage + 1) * stocksPerPage);

  return (
    <div className="overflow-x-auto text-sm mb-4">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400">
            <th className="p-2">종목</th>
            <th className="p-2 text-right">현재가</th>
            <th className="p-2 text-right">등락률</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStocks.map((stock) => {
            // ✅ 최신 날짜의 close_price 가져오기
            const latestClosePrice = stock.data?.length > 0 ? stock.data[stock.data.length - 1].close_price : "N/A";

            // ✅ 등락률 계산 (최신 close_price - 이전 close_price)
            let changeRate = "N/A";
            if (stock.data?.length > 1) {
              const prevClosePrice = stock.data[stock.data.length - 2].close_price;
              changeRate = ((latestClosePrice - prevClosePrice) / prevClosePrice * 100).toFixed(2) + "%";
            }

            return (
              <tr
                key={stock.stock_id} // ✅ stock_id를 고유 식별자로 사용
                className="border-b border-gray-600 last:border-b-0 cursor-pointer hover:bg-gray-800"
                onClick={() => onStockSelect(stock)} // 선택된 종목 설정
              >
                <td className="p-2 font-bold">{stock.stock}</td>
                <td className="p-2 text-right">
                  {latestClosePrice !== "N/A" ? latestClosePrice.toLocaleString() + "원" : "N/A"}
                </td>
                <td className="p-2 text-right">{changeRate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-center mt-3 space-x-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          className="px-3 py-1 bg-gray-700 rounded text-gray-200 disabled:opacity-50"
          disabled={currentPage === 0}
        >
          이전
        </button>
        <button
          onClick={() => setCurrentPage((prev) => (prev + 1) * stocksPerPage < stocks.length ? prev + 1 : prev)}
          className="px-3 py-1 bg-gray-700 rounded text-gray-200 disabled:opacity-50"
          disabled={(currentPage + 1) * stocksPerPage >= stocks.length}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default StockList;
