import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import OrderPanel from "../components/OrderPanel";
import CandleStick from "../components/CandleStick";
import RollingInfo from "../components/RollingInfo";
import NewsTicker from "../components/NewsTicker";
import StockList from "../components/StockList";

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

const TradePage = () => {
  const [stocks, setStocks] = useState([]); // API에서 가져온 주식 목록
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/stocks/start-game/", {
          method: "POST",
          credentials: "include",  // ✅ 세션 쿠키 포함
          headers: {
            "X-CSRFToken": getCookie("csrftoken"), // JSON으로 요청
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("서버 응답 실패");
        }
  
        const data = await response.json();
        console.log(data.data);
        setStocks(data.data); // 전체 종목 리스트 저장
        setGameId(data.game_id);
        console.log(gameId);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
  
    fetchStockData();
  }, []);

  const handleStockSelect = (stock , index) => {
      setSelectedStock(stock);
      setSelectedIndex(index);
  }
  
  console.log(gameId);
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      <NewsTicker />
      <main className="flex-1 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 메인 영역 */}
          <section className="lg:w-3/4 bg-gray-800 p-4 rounded-lg">
            <CandleStick selectedStock={selectedStock} /> {/* 선택된 종목의 차트 표시 */}
            <StockList stocks={stocks} onStockSelect={handleStockSelect} /> {/* StockList에서 클릭하면 차트 변경 */}
          </section>

          {/* 사이드바 (주문 패널) */}
          <aside className="lg:w-1/4 bg-gray-800 p-4 rounded-lg">
          {gameId ? <OrderPanel stock={selectedStock} stockIndex = {selectedIndex} gameId={gameId}  /> : <p>게임 ID 로딩 중...</p>}
          </aside>
        </div>
      </main>

      <RollingInfo />
      <Footer />
    </div>
  );
};

export default TradePage;
