import React from "react";
import "./bottom.css";

const App = () => {
  return (
    <div className="navbar">
      <div className="left-section">
        <div className="user-info">
          <img src="svg/user-icon.svg" alt="User Icon" className="user-icon" />
          <span className="username">류강현</span>
          <span className="status">활동중</span>
          <span className="status-dot on"></span>
        </div>
        <div className="center-section">
          <button className="nav-button">
            <img src="svg/microphone-icon.svg" alt="Microphone" />
          </button>
          <button className="nav-button">
            <img src="svg/video-icon.svg" alt="Video" />
          </button>
          <button className="nav-button">
            <img src="svg/emoji-icon.svg" alt="emoji" />
          </button>
          <button className="nav-button">
            <img src="svg/fullscreen-icon.svg" alt="Fullscreen" />
          </button>
        </div>
      </div>
      <div className="right-section">
        <button className="nav-button">
          <img src="svg/bell-icon.svg" alt="Bell" />
        </button>
        <button className="nav-button">
          <img src="svg/calendar-icon.svg" alt="Calendar" />
        </button>
        <button className="nav-button">
          <img src="svg/chat-icon.svg" alt="Chat" />
        </button>
        <button className="nav-button">
          <img src="svg/group-icon.svg" alt="Group" />
          <div className="notification-count">23</div>
        </button>
      </div>
    </div>
  );
};

export default App;
