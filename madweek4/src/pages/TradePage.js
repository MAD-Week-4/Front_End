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
  const [stocks, setStocks] = useState([]); // 주식 목록
  const [selectedStock, setSelectedStock] = useState(null);
  const [gameId, setGameId] = useState(null);

  const [capital, setCapital] = useState(0); // 예수금
  const [stockValue, setStockValue] = useState(0); // 주식 가치
  const [netWorth, setNetWorth] = useState(0); // 총 자산

  // ✅ 최신 주식 데이터 가져오는 함수
  const fetchStockData = async () => {
    try {
      if (!gameId) return;

      const response = await fetch(`http://localhost:8000/api/v1/stocks/${gameId}/get-stock/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      if (!response.ok) {
        throw new Error("주식 데이터 가져오기 실패");
      }

      const data = await response.json();
      console.log("📊 최신 주식 데이터:", data.data);

      setStocks(data.data);
      if (selectedStock) {
        const updatedStock = data.data.find((s) => s.stock_id === selectedStock.stock_id);
        setSelectedStock(updatedStock || null);
      }

    } catch (error) {
      console.error("Stock data fetch error:", error);
    }
  };

  // ✅ 최신 자산 데이터 가져오는 함수
  const fetchNetWorth = async () => {
    try {
      if (!gameId) return;

      const response = await fetch(`http://localhost:8000/api/v1/stocks/${gameId}/net-worth/`,{
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      });
      if (!response.ok) {
        throw new Error("자산 데이터 가져오기 실패");
      }

      const data = await response.json();
      console.log("💰 최신 자산 데이터:", data);

      setCapital(data.capital ?? 0);
      setStockValue(data.stock_value ?? 0);
      setNetWorth(data.net_worth ?? 0);

    } catch (error) {
      console.error("Net Worth fetch error:", error);
    }
  };

  // ✅ 게임 시작 요청 및 초기 데이터 로딩
  useEffect(() => {
    const startGame = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/stocks/start-game/", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("서버 응답 실패");
        }

        const data = await response.json();
        console.log("🕹️ 게임 시작:", data);
        setStocks(data.data);
        setGameId(data.game_id);
      } catch (error) {
        console.error("Error starting game:", error);
      }
    };

    startGame();
  }, []);

  // ✅ gameId가 설정된 후 자산 정보 가져오기
  useEffect(() => {
    if (gameId) {
      fetchNetWorth();
    }
  }, [gameId]);

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      {/* ✅ NewsTicker 위치를 왼쪽에서 살짝 오른쪽으로 이동 */}
      <div className="ml-10">  
        <NewsTicker />
      </div>

      <main className="flex-1 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 메인 영역 */}
          <section className="lg:w-3/4 bg-gray-800 p-4 rounded-lg">
            <CandleStick selectedStock={selectedStock} />
            <StockList stocks={stocks} onStockSelect={setSelectedStock} />
          </section>

          {/* 사이드바 (주문 패널 및 자산 현황) */}
          <aside className="lg:w-1/4 bg-gray-800 p-4 rounded-lg">
            {gameId ? (
              <>
                {/* ✅ OrderPanel */}
                <OrderPanel 
                  stock={selectedStock} 
                  gameId={gameId} 
                  updateStockData={fetchStockData} 
                  updateNetWorth={fetchNetWorth} 
                  capital={capital} 
                />

                {/* ✅ 자산 현황 패널 (OrderPanel 아래로 이동) */}
                <div className="mt-4 p-4 bg-gray-700 text-white rounded-lg">
                  <h3 className="text-lg font-bold">자산 현황</h3>
                  <p>📌 예수금: {capital.toLocaleString()} 원</p>
                  <p>📌 주식 가치: {stockValue.toLocaleString()} 원</p>
                  <p>📌 총 자산: {netWorth.toLocaleString()} 원</p>
                </div>
              </>
            ) : (
              <p>게임 ID 로딩 중...</p>
            )}
          </aside>
        </div>
      </main>

      <RollingInfo />
    </div>
  );
};

export default TradePage;
