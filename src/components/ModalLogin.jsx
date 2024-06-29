import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ModalLogin.css";
import io from "socket.io-client";

const ModalLogin = ({ isOpen, onClose, children }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("localhost:3001");

    socket.on("connect", function () {
      console.log("Socket.IO connected.");
      // socket.emit('join', {username: 'testuser'});
    });

    socket.on("message", function (data) {
      console.log("Received: " + data);
    });

    socket.on("disconnect", function () {
      console.log("Socket.IO disconnected.");
    });

    socket.on("error", function (error) {
      console.log("Socket.IO Error: " + error);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Perform login logic here
    console.log("Username:", username);
    console.log("Password:", password);

    sessionStorage.setItem("username", username);
    if (socket && socket.connected) {
      socket.emit("join", { username: username });
    }
    navigate("/main");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="modal-wrapper">
        <div className="modal">
          <div className="body">
            <form className="form-login">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              ></input>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              ></input>
            </form>
          </div>
          <div className="footer">
            <button onClick={handleLogin}>Login</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalLogin;
