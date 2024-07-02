import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
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
    const user = { 
      id:username, 
      name:username, 
      pw:password, 
      user_type: 'U'
    };
    axios.post('http://192.168.0.96:3333/user/login',{ user })
    .then(response =>{
        console.log(response);
        if(response.data == null || response.data == '')
            return alert("로그인이 실패하였습니다.");
        if(response.data.msg === 'Ok'){
          sessionStorage.setItem("user",JSON.stringify(response.data));
          sessionStorage.setItem("username", username);

          navigate("/main");
        }else{
          alert(response.data.msg);
        }
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
                      const user = { 
                        id:name, 
                        name:name, 
                        user_type: 'G'
                      };
                      axios.post('http://192.168.0.96:3333/user/login',{ user })
                      .then(response =>{
                          console.log(response);
                          if(response.data == null || response.data == '')
                              return alert("로그인이 실패하였습니다.");
                  
                          sessionStorage.setItem("user",JSON.stringify(response.data));
                          sessionStorage.setItem("username", name);
                      
                          navigate("/main");
                      })
                      .catch(error=>{
                          console.error('Error fetching data:', error);
                          return alert("에러가 발생했습니다.");
                      });
                  


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
