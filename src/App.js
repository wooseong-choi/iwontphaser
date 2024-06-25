import React from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/Login";
import GameApp from "./games/GameApp";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="game" element={<GameApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
