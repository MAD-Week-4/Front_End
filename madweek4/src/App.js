import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TradePage from "./pages/TradePage";
import LoginPage from "./pages/LoginPage";
import GameResultsPage from "./pages/GameResultsPage";
import AIUserResultPage from "./pages/AIUserResultPage";
import ResultTab from "./pages/ResultTab";

function App() {
  // 로그인 상태를 전역으로 관리하기 위해 App에서 useState로 상태 선언
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {/* Navbar에 로그인 상태와 로그인을 변경할 수 있는 함수 전달 */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trade" element={<TradePage />} />
        {/* LoginPage에도 setIsLoggedIn 전달 */}
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/result" element={<ResultTab />} />
      </Routes>
    </>
  );
}

export default App;
