import React, { useState, useEffect } from "react";
import { FaBullhorn } from "react-icons/fa6"; // 🔹 확성기 아이콘 추가

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/news") // Django 백엔드 API 엔드포인트
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          console.error("⚠️ 잘못된 데이터 형식:", data);
        }
      })
      .catch((error) => console.error("⚠️ 뉴스 가져오기 실패:", error));
  }, []);

  // 3초마다 뉴스 변경 (하나씩 표시)
  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [news]);

  return (
    <div className="news-ticker-container">
      <div className="news-ticker-wrapper">
        {news.length > 0 ? (
          <div
            className="news-item fade-in"
            key={currentIndex} // ✅ key 변경 시 애니메이션 적용
            onClick={() => window.open(news[currentIndex]?.link, "_blank")}
          >
            <FaBullhorn className="news-icon" />
            <span className="news-label">뉴스</span>
            <span className="news-title">
              {news[currentIndex]?.title.replace(/<b>|<\/b>/g, "")}
            </span>
          </div>
        ) : (
          <div className="news-item">
            <FaBullhorn className="news-icon" />
            <span className="news-label">뉴스</span>
            <span className="news-title">📢 뉴스 데이터를 불러오는 중...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsTicker;
