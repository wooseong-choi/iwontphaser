import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./ModalLogin.css";


const ModalLogin = ({ isOpen, onClose, children }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const clientId = '99709035135-lq4adkjjk5trck2eg2fsi3aagilljfmv.apps.googleusercontent.com';

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
              <div className="login-google">
                <GoogleOAuthProvider clientId={clientId} >
                  <GoogleLogin 
                    onSuccess={(response) => {
                      console.log("Google Login Success:", response);
                      const token = response.credential;
                      // 복호화 로직
                      const jwt = jwtDecode(token);
                      console.log(jwt);
                      const name = jwt.email;
                      sessionStorage.setItem("username", name);
                      navigate("/main");
                    }}
                    onFailure={(response) => {
                      console.log("Google Login Failure:", response);
                    }}
                    
                  />
                </GoogleOAuthProvider>
              </div>
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
