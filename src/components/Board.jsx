import React from "react";
import "./board.css";

const App = () => {
  return (
    <div className="navbar">
      <div className="left-section">
        <div className="user-info">
          <img src="user-icon.png" alt="User Icon" className="user-icon" />
          <span className="username">류강현</span>
          <span className="status">활동중</span>
        </div>
      </div>
      <div className="center-section">
        <button className="nav-button">
          <img src="microphone-icon.png" alt="Microphone" />
        </button>
        <button className="nav-button">
          <img src="video-icon.png" alt="Video" />
        </button>
        <button className="nav-button">
          <img src="settings-icon.png" alt="Settings" />
        </button>
      </div>
      <div className="right-section">
        <button className="nav-button">
          <img src="bell-icon.png" alt="Bell" />
        </button>
        <button className="nav-button">
          <img src="calendar-icon.png" alt="Calendar" />
        </button>
        <button className="nav-button">
          <img src="chat-icon.png" alt="Chat" />
        </button>
        <button className="nav-button">
          <img src="group-icon.png" alt="Group" />
        </button>
        <div className="notification-count">23</div>
      </div>
    </div>
  );
};

export default App;
