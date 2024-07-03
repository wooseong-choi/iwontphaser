import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GLogin from "./GLogin";
import "./ModalLogin.css";
import { login } from "../api/login";
import { setCookie } from "./Cookies.ts";

const ModalLogin = ({ isOpen, onClose, children }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const clientId =
    "99709035135-lq4adkjjk5trck2eg2fsi3aagilljfmv.apps.googleusercontent.com";

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // Perform login logic here
    // console.log("Username:", username);
    // console.log("Password:", password);
    const user = {
      id: username,
      name: username,
      pw: password,
      user_type: "U",
    };
    // login(user).then((response) => {
    //   console.log(response);
    //   if (response.data == null || response.data == "")
    //     return alert("로그인이 실패하였습니다.");
    //   if (response.data.msg === "Ok") {
    //     sessionStorage.setItem("user", JSON.stringify(response.data));
    //     sessionStorage.setItem("username", username);
    //     navigate("/main");
    //   } else {
    //     alert(response.data.msg);
    //   }
    // });
    axios
      .post("http://localhost:3333/user/login", { user })
      .then((response) => {
        console.log(response);
        if(response.data == null || response.data == '')
            return alert("로그인이 실패하였습니다.");
        if(response.data.msg === 'Ok'){
          
          if(response.data.jwt){

            const option = {
              Path:'/',
              HttpOnly:true,
              SameSite:'None',
              Secure:true,
              expires: new Date(new Date().getTime() + (60*60*1000*24*14))
            };
            
            setCookie('refresh_token',response.data.jwt,option);
          }
          console.log( jwtDecode(response.data.jwt) );
          sessionStorage.setItem("user",response.data.jwt);
          sessionStorage.setItem("username", username);
          navigate("/main");
        } else {
          alert(response.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return alert("에러가 발생했습니다.");
      });
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
                <GLogin />
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
