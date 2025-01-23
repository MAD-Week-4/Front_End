import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


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

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [thirdPartyAgreed, setThirdPartyAgreed] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 약관 동의 확인
    if (!termsAgreed || !privacyAgreed || !thirdPartyAgreed) {
      alert("모든 약관에 동의해야 합니다.");
      return;
    }

    // FormData 생성
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      // ✅ form-data 형식으로 서버에 전송
      console.log(getCookie("csrftoken"))
      const response = await fetch("http://localhost:8000/api/v1/auth/login/", {
        method: "POST",
        body: formData, // ✅ FormData 객체 전달 (headers 설정 안함!)
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),

        }

      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        // 로그인 성공 시
        setIsLoggedIn(true);
        navigate("/");
      } else {
        // 로그인 실패 시
        alert("로그인 실패!");
      }
      
    } catch (error) {
      console.error("로그인 중 에러 발생:", error);
      alert("로그인 실패!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-xl font-semibold mb-6">로그인</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-700 rounded-lg"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 bg-gray-700 rounded-lg"
          />

          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={() => setTermsAgreed(!termsAgreed)}
              />
              <span className="ml-2">필수 약관에 모두 동의</span>
            </label>
          </div>
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={() => setPrivacyAgreed(!privacyAgreed)}
              />
              <span className="ml-2">개인정보 수집 · 이용 동의</span>
            </label>
          </div>
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={thirdPartyAgreed}
                onChange={() => setThirdPartyAgreed(!thirdPartyAgreed)}
              />
              <span className="ml-2">개인정보 제3자 제공 동의</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 p-2 rounded-lg">
            로그인
          </button>
        </form>

        <div className="text-center mt-4 text-blue-400">
          <p>아직 회원이 아닌가요?</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
