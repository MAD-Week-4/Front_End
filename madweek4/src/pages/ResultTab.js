import { useState } from "react";
import styled from "styled-components";
import GameResultsPage from "./GameResultsPage";
import AIUserResultPage from "./AIUserResultPage";

const TabContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000; /* 전체 배경 검정색 */
  min-height: 100vh; /* 화면 전체 높이 */
  padding-top: 20px;
`;

const TabMenu = styled.ul`
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: #111; /* 탭 바 검정색 */
  border-radius: 8px;
  overflow: hidden;
`;

const TabItem = styled.li`
  width: 50%; /* 두 개의 탭이 화면 절반씩 차지 */
  text-align: center;
  padding: 16px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => (props.active ? "#fff" : "#bbb")};
  background-color: ${(props) => (props.active ? "#ff6b6b" : "#222")}; /* 선택된 탭 강조 */
  transition: all 0.3s ease-in-out;
  border-bottom: ${(props) => (props.active ? "4px solid #ff4d4d" : "none")};

  &:hover {
    background-color: #333;
    color: #fff;
  }
`;

const TabContent = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #000; /* 컨텐츠 배경 검정색 */
  color: white;
`;

const Tab = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const menu = [
    { name: "Game Results", component: <GameResultsPage /> },
    { name: "AI User Results", component: <AIUserResultPage /> },
  ];

  return (
    <TabContainer>
      <TabMenu>
        {menu.map((item, index) => (
          <TabItem
            key={index}
            active={currentTab === index}
            onClick={() => setCurrentTab(index)}
          >
            {item.name}
          </TabItem>
        ))}
      </TabMenu>
      <TabContent>{menu[currentTab].component}</TabContent>
    </TabContainer>
  );
};

export default Tab;
