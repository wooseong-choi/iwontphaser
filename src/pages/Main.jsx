// src/pages/Main.jsx
import React from "react";
import GameApp from "../games/GameApp";
import Board from "../components/Board";

const Main = () => {
  return (
    <>
      <div>
        <GameApp />
        <Board />
      </div>
    </>
  );
};

export default Main;
