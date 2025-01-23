import React from "react";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();

    const handleClick = () => {
    // 버튼을 누르면 /trade 로 이동
        navigate("/trade");
    };

  return (
    <div 
      className="w-full text-center py-20 bg-gray-100"
      style={{ 
        backgroundImage: `url(${logo})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <h1 className="text-4xl font-bold text-white">대한민국 투자의 미래를 응원합니다</h1>
      <p className="text-gray-200 mt-2">가능성을 보는 모의투자</p>
      <button className="mt-6 px-6 py-3 bg-black text-white rounded" onClick={handleClick}>시작하기</button>
    </div>
  );
};

export default HeroSection;
