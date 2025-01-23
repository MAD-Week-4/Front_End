import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

const OrderPanel = ({ stock, gameId, updateStockData, updateNetWorth, capital, fetchUserStockData }) => {
  console.log("OrderPanel received gameId:", gameId);
  console.log("OrderPanel received stock:", stock);
  console.log("OrderPanel received gameId:", gameId);
  console.log("OrderPanel received capital:", capital); // ✅ 최신 예수금 값 확인


  const [orderType, setOrderType] = useState("지정가");
  const [tradeType, setTradeType] = useState("매수");
  const [price, setPrice] = useState(stock ? stock.data?.[0]?.open_price : "");
  const [quantity, setQuantity] = useState("");
  const [dayCount, setDayCount] = useState(1);
  const navigate = useNavigate();

  const balance = capital ?? 0; // 예수금 (1억 원)
  const effectivePrice = orderType === "시장가" ? stock?.data?.[0]?.close_price : price;
  const maxBuyQuantity = effectivePrice ? Math.floor(balance / effectivePrice) : 0;

  

  useEffect(() => {
    if (orderType === "시장가") {
      setPrice("");
    }
  }, [orderType]);

  if (!stock) return <p className="text-gray-400">주문할 종목을 선택하세요.</p>;

  const handleOrder = async () => {
    if (!quantity || quantity <= 0) {
      alert("수량을 입력하세요.");
      return;
    }
    if (!stock.stock_id) {
      alert("주식 ID를 찾을 수 없습니다.");
      return;
    }


    const endpoint = tradeType === "매수"
      ? `http://localhost:8000/api/v1/stocks/${gameId}/buy/`
      : `http://localhost:8000/api/v1/stocks/${gameId}/sell/`;

    const formData = new FormData();
    formData.append("stock_id", stock.stock_id);
    formData.append("quantity", quantity);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("주문 실패");
      }

      const data = await response.json();
      alert(`주문 완료: ${data.message}`);
    } catch (error) {
      console.error("주문 오류:", error);
      alert("주문 중 오류 발생");
    }
  };

  const handleComplete = async () => {
    if (!gameId) {
      alert("게임 ID가 없습니다.");
      return;
    }

    setDayCount(prev => {
      const updatedDayCount = prev + 1;
      if (updatedDayCount >= 10) {
        alert("게임이 종료되었습니다. 결과 페이지로 이동합니다.");
        navigate("/end");
        return prev; 
      }
      alert(`${prev}일차 -> ${updatedDayCount}일차로 이동되었습니다.`);
      return updatedDayCount;
    });

    try {
      await fetch(`http://localhost:8000/api/v1/stocks/${gameId}/next-day/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });



      if (typeof updateStockData === "function") {
        await updateStockData(); // ✅ 최신 주식 데이터 업데이트
      }

      if (typeof updateNetWorth === "function") {
        await updateNetWorth(); // ✅ 최신 자산 데이터 업데이트
      }
      if (typeof fetchUserStockData === "function") {
        console.log("🔄 fetchUserStockData 실행");
        await fetchUserStockData();
      }

    } catch (error) {
      console.error("완료 처리 중 오류:", error);
      alert("완료 처리 중 오류 발생");
    }
  };


  return (
    <div className="bg-gray-700 p-4 rounded">
      <h3 className="text-xl font-bold mb-4">{stock.name} 주문</h3>

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

      {/* 가격 입력 */}
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
          <p className="text-xs text-gray-400 mt-1">
            최대 매수 가능: {maxBuyQuantity.toLocaleString()}주 (잔고: {balance.toLocaleString()}원)
          </p>
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
