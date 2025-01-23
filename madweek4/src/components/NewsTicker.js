import React, { useState, useEffect } from "react";
import { FaBullhorn } from "react-icons/fa6"; // 🔹 확성기 아이콘 추가

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/news") // Django 백엔드 API 엔드포인트
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
  console.log(news);

  // 3초마다 뉴스 변경 (하나씩 표시)
  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [news]);

  const handleClick = (link) => {
    console.log("🔗 뉴스 URL:", link); // 콘솔에서 URL 확인
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      console.error("⚠️ 유효한 URL이 없습니다.");
    }
  };

  return (
    <div className="news-ticker-container">
      <div className="news-ticker-wrapper">
        <div className="news-item fade-in" key={currentIndex}>
          <FaBullhorn className="news-icon" />
          <span className="news-label"></span>
          {news.length > 0 ? (
            <a
              href={news[currentIndex]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-title"
              onClick={(e) => {
                e.preventDefault(); // 기본 동작 방지 (혹시 모를 오류 방지)
                handleClick(news[currentIndex]?.link);
              }}
            >
              {news[currentIndex]?.title.replace(/<b>|<\/b>/g, "")}
            </a>
          ) : (
            <span className="news-title">뉴스 데이터를 불러오는 중...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
