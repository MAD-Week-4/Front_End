

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

const MyStocks = ({ gameId, userHoldings}) => {
  

  console.log("🔍 MyStocks received gameId:", gameId);
  console.log("🔍 CSRF Token:", getCookie("csrftoken"));

  return (
    <div className="bg-gray-800 mx-4 my-6 p-4 rounded-lg shadow-md text-white">
      <h3 className="text-lg font-bold mb-2">📋 내 보유 종목</h3>
      <div className="max-h-64 overflow-y-auto border border-gray-600 rounded-md">
      {userHoldings?.length > 0 ? (
        <table className="w-full border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 p-2 text-left">종목명</th>
              <th className="border border-gray-600 p-2 text-right">보유 수량</th>
            </tr>
          </thead>
          <tbody>
            {userHoldings.map((holding, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="border border-gray-600 p-2">{holding.stock_name}</td>
                <td className="border border-gray-600 p-2 text-right">{holding.quantity?.toLocaleString() ?? "0"}주</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">보유 중인 주식이 없습니다.</p>
      )}
    </div>
    </div>

  );
  
};

export default MyStocks;
