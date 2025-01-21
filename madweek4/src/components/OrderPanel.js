import React, { useState } from "react";

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

const OrderPanel = ({ stock, gameId }) => {
  console.log(gameId);
  const [orderType, setOrderType] = useState("지정가"); // 주문 유형: 지정가 / 시장가
  const [tradeType, setTradeType] = useState("매수"); // 거래 유형: 매수 / 매도
  const [price, setPrice] = useState(stock ? stock.price : ""); // 종목 가격
  const [quantity, setQuantity] = useState(""); // 수량 입력

  const balance = 100000000; // 예수금 (예시)
  const maxBuyQuantity = stock ? Math.floor(balance / stock.price) : 0; // 매수 가능 수량
  const totalCost = quantity * (price || 0); // 총 주문 금액

  if (!stock) return <p className="text-gray-400">주문할 종목을 선택하세요.</p>;

  const handleOrder = () => {
    if (!quantity || quantity <= 0) {
      alert("수량을 입력하세요.");
      return;
    }
    alert(`${stock.name} ${tradeType} 주문 완료 (${quantity}주, ${totalCost.toLocaleString()}원)`);
  };

  const handleComplete = async () => {
    if (!gameId) {
      alert("게임 ID가 없습니다.");
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/stocks/${gameId}/next-day/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
      
      const data = await response.json();
      alert("다음 날로 이동되었습니다.");
      console.log("Next day response:", data);
    } catch (error) {
      console.error("Error moving to next day:", error);
      alert("다음 날 이동 중 오류 발생");
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded">
      <h3 className="text-xl font-bold mb-4">{stock.name} 주문</h3>

      {/* 예수금 표시 */}
      <div className="bg-gray-800 p-3 rounded mb-4">
        <h4 className="text-md font-semibold mb-1">예수금</h4>
        <p className="text-sm text-gray-300 font-bold">{balance.toLocaleString()}원</p>
      </div>

      {/* 주문 유형 선택 */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">주문 유형</label>
        <select
          className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:outline-none"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
        >
          <option value="지정가">지정가</option>
          <option value="시장가">시장가</option>
        </select>
      </div>

      {/* 거래 유형 선택 */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">거래 유형</label>
        <select
          className="w-full bg-gray-900 border border-gray-600 rounded p-2 focus:outline-none"
          value={tradeType}
          onChange={(e) => setTradeType(e.target.value)}
        >
          <option value="매수">매수</option>
          <option value="매도">매도</option>
        </select>
      </div>

      {/* 가격 입력 (지정가일 때만 활성화) */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">가격</label>
        <div className="flex">
          <input
            type="number"
            className="w-full bg-gray-900 border border-gray-600 rounded-l p-2 focus:outline-none"
            value={orderType === "시장가" ? "" : price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="가격 입력"
            disabled={orderType === "시장가"}
          />
          <span className="bg-gray-700 border border-gray-600 border-l-0 rounded-r px-3 flex items-center">원</span>
        </div>
      </div>

      {/* 수량 입력 */}
      <div className="mb-4">
        <label className="block mb-1 text-sm">수량</label>
        <div className="flex">
          <input
            type="number"
            className="w-full bg-gray-900 border border-gray-600 rounded-l p-2 focus:outline-none"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="수량 입력"
          />
          <span className="bg-gray-700 border border-gray-600 border-l-0 rounded-r px-3 flex items-center">주</span>
        </div>
        {tradeType === "매수" && (
          <p className="text-xs text-gray-400 mt-1">최대 매수 가능: {maxBuyQuantity.toLocaleString()}주</p>
        )}
      </div>

      {/* 주문 버튼 */}
      <button
        onClick={handleOrder}
        className={`w-full text-white py-2 rounded ${
          tradeType === "매수" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {tradeType} 주문하기
      </button>

      {/* 완료하기 버튼 */}
      <button
        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        onClick={handleComplete}
      >
        완료하기
      </button>
    </div>
  );
};

export default OrderPanel;