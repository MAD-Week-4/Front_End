import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const defaultImage = "../assets/images/not image.png";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/news/");
        setNews(response.data.slice(0, 3)); // 상위 3개의 뉴스만 표시
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="py-8 px-6 bg-black text-white">
      <h2 className="text-2xl font-bold text-center mb-6">📢 주요 뉴스</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <a 
            key={index} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            <img 
              src={item.image || defaultImage} 
              alt={item.title} 
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
