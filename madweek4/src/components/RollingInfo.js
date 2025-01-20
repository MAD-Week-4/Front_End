import React from "react";
import Marquee from "react-fast-marquee";

const RollingInfo = () => {
  const infoItems = [
    "S&P500 5,996.66",
    "VIX 15.97",
    "코스피 2,523.55",
    "코스닥 724.69",
    "달러 인덱스 109.35",
    "달러 환율 1,460.8",
    "나스닥 19,630.2",
  ];

  return (
    <div className="relative z-50 bg-blue-800 text-white p-4">
      <Marquee gradient={false} speed={100} pauseOnHover={true}>
        {infoItems.map((item, index) => (
          <span key={index} className="mx-10">{item}</span> 
        ))}
      </Marquee>
    </div>
  );
};

export default RollingInfo;

