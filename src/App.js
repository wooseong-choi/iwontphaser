import React, { useState } from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login";
import GameApp from "./games/GameApp";
import NotFound from "./pages/NotFound";
import Board from "./components/Bottom.jsx";
import Main from "./pages/Main.jsx";

function App() {
  const [isListOpen, setIsListOpen] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main isListOpen={isListOpen} setIsListOpen={setIsListOpen} />} />
        <Route path="/board" element={<Board />} />
        <Route path="/game" element={<GameApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
