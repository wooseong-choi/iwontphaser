// src/pages/Main.jsx
import React, { useEffect, useState, useRef } from "react";
import GameApp from "../games/GameApp";
import Bottom from "../components/Bottom.jsx";
import List from "../components/List";
import VideoCanvas from "./../components/OpenVidu/VideoCanvas.tsx";
import "./Main.css";

const Main = ({ isListOpen, setIsListOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const ov = useRef(null);
  const session = useRef(null);

  useEffect(() => {
    if (isOpen || isChatOpen) {
      setIsListOpen(true);
    } else {
      setIsListOpen(false);
    }
  }, [isOpen, isChatOpen]);

  const startVideoStream = (e) => {
    e.preventDefault();
    console.log("startVideoStream");
    isVideoOpen ? setIsVideoOpen(false) : setIsVideoOpen(true);
  };

  window.addEventListener("start-video", startVideoStream);

  return (
    <>
      <div>
        <div id="GameApp" className="flex">
          <div id="canvas-parent" className="flex main">
            <div className="video-container">
              <button
                className="video-button"
                onClick={startVideoStream}
              ></button>
              {isVideoOpen ? <VideoCanvas /> : null}
            </div>
            <div id="gameMain" className="game">
              <GameApp />
            </div>
            <div className={`lists ${isListOpen ? "open" : ""}`}>
              <List
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
              />
            </div>
          </div>
          <Bottom
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
          />
        </div>
      </div>
    </>
  );
};

export default Main;
