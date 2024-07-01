import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./ModalLogin.css";


const ModalRegist = ({ isOpen, onClose, children }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleregist = () => {
    // Perform login logic here
    console.log("Username:", username);
    console.log("Password:", password);
    const user = { 
      id:username, 
      name:username, 
      pw:password, 
      user_type: 'U'
    };
    axios.post('http://localhost:3333/user/create',{ user })
    .then(response =>{
        console.log(response);
        if(response.data == null || response.data == '')
            return alert("회원가입이 실패하였습니다.");

        sessionStorage.setItem("user",JSON.stringify(response.data));
        sessionStorage.setItem("username", username);
    
        navigate("/main");
    })
    .catch(error=>{
        console.error('Error fetching data:', error);
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
            </form>
          </div>
          <div className="footer">
            <button onClick={handleregist}>Regist</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalRegist;
