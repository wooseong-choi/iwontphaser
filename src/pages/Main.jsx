// src/pages/Main.jsx
import React, { useEffect, useState } from "react";
import GameApp from "../games/GameApp";
import Bottom from "../components/Bottom.jsx";
import List from "../components/List";
import "./Main.css";

const Main = ({isListOpen, setIsListOpen}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  useEffect(() => {

    if(isOpen || isChatOpen){
        setIsListOpen(true);
    }else{
      setIsListOpen(false);
    }
  },[isOpen, isChatOpen]);
  return (
    <>
      <div>
        <div id="GameApp" className="flex">
          <div id="canvas-parent" className="flex main">
            <div id="gameMain" className="game">
              <GameApp />
            </div>
            <div className={`lists ${isListOpen ? 'open' : ''}`}>
              <List isOpen={isOpen} setIsOpen={setIsOpen} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}/>
            </div>
          </div>
          <Bottom isOpen={isOpen} setIsOpen={setIsOpen} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}/>      
        </div>
      </div>
    </>
  );
};

export default Main;
