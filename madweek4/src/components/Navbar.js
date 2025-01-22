import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      // 이미 로그인 상태라면 -> 로그아웃 처리
      setIsLoggedIn(false);
      // 로그아웃 후 메인 페이지로 이동할 수도 있음 (필요시)
      navigate("/");
    } else {
      // 로그인 상태가 아니라면 -> 로그인 페이지로 이동
      navigate("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-2 bg-black shadow-md">
      <div className="text-blue-400 font-bold text-lg"
           style={{ cursor: "pointer" }}
           onClick={() => navigate("/")}
      >MoTu</div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleButtonClick}>
        {isLoggedIn ? "로그아웃" : "로그인"}
      </button>
    </nav>
  );
};

export default Navbar;
