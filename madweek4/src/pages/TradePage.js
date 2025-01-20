import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import AiPerformance from "../components/AiPerformance";
import OrderPanel from "../components/OrderPanel";
import CandleStick from "../components/CandleStick";
import RollingInfo from "../components/RollingInfo";
import NewsTicker from "../components/NewsTicker";
import StockList from "../components/StockList";

const TradePage = () => {
  const [stocks, setStocks] = useState([]); // API에서 가져온 주식 목록
  const [selectedStock, setSelectedStock] = useState(null);
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    console.log(cookieValue);
    return cookieValue;
  };
  

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/stocks/start-game/", {
          method: "POST",
          credentials: "include",  // ✅ 세션 쿠키 포함
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"), // JSON으로 요청
          },
          body: JSON.stringify({}), // API에 필요한 경우, 빈 객체라도 전송
        });
  
        if (!response.ok) {
          throw new Error("서버 응답 실패");
        }
  
        const data = await response.json();
        setStocks(data.data); // 전체 종목 리스트 저장
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
  
    fetchStockData();
  }, []);
  
  

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      <NewsTicker />
      <main className="flex-1 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 메인 영역 */}
          <section className="lg:w-3/4 bg-gray-800 p-4 rounded-lg">
            <CandleStick selectedStock={selectedStock} /> {/* 선택된 종목의 차트 표시 */}
            <StockList stocks={stocks} onStockSelect={setSelectedStock} /> {/* StockList에서 클릭하면 차트 변경 */}
          </section>

          {/* 사이드바 (주문 패널) */}
          <aside className="lg:w-1/4 bg-gray-800 p-4 rounded-lg">
            <OrderPanel stock={selectedStock} />
          </aside>
        </div>
      </main>

      <RollingInfo />
      <Footer />
    </div>
  );
};

export default TradePage;
