// src/pages/Main.jsx
import React from "react";
import GameApp from "../games/GameApp";
import Bottom from "../components/Bottom.jsx";
import List from "../components/List";

const Main = () => {
  return (
    <>
      <div>
        <div id="GameApp" className="flex">
          <div id="canvas-parent" className="flex main">
            <GameApp />
            <div className="lists">
              <List/>
            </div>
          </div>
          <Bottom/>      
        </div>
      </div>
    </>
  );
};

export default Main;
