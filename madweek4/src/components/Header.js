import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 버튼을 누르면 /trade 로 이동
    navigate("/trade");
  };

  return (
    <header className="header">
      <h1>대한민국 투자의 미래를 응원합니다</h1>
      <p>가능성을 보는 투자 전략</p>
      <button className="start-button" onClick={handleClick}>
        시작하기
      </button>
    </header>
  );
};

export default Header;
