import { useState } from "react";
import styled from "styled-components";
import GameResultsPage from "./GameResultsPage";
import AIUserResultPage from "./AIUserResultPage";

const TabMenu = styled.ul`
  display: flex;
  cursor: pointer;
`;

const Tab = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const menu = [
    { name: "Game Results", component: <GameResultsPage /> },
    { name: "AI User Results", component: <AIUserResultPage /> },
  ];

  const handleClick = (index) => {
    setCurrentTab(index);
  };

  return (
    <div>
      <TabMenu>
        {menu.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(index)}
            style={{
              padding: "10px",
              borderBottom: currentTab === index ? "2px solid black" : "none",
            }}
          >
            {item.name}
          </li>
        ))}
      </TabMenu>
      <div>{menu[currentTab].component}</div>
    </div>
  );
};

export default Tab;