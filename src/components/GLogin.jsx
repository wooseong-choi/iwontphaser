import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GLogin = () => {
  const navigate = useNavigate();
  const clientId =
    "99709035135-lq4adkjjk5trck2eg2fsi3aagilljfmv.apps.googleusercontent.com";

  const handleSuccess = (response) => {
    const token = response.credential;
    const jwt = jwtDecode(token);

    const name = jwt.email;
    const user = {
      id: name,
      name: name,
      user_type: "G",
    };
    axios
      .post("http://localhost:3333/user/login", { user })
      .then((response) => {
        // console.log(response);
        if (response.data == null || response.data == "")
          return alert("로그인이 실패하였습니다.");

        sessionStorage.setItem("user", JSON.stringify(response.data));
        sessionStorage.setItem("username", name);
        navigate("/main");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return alert("에러가 발생했습니다.");
      });
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onFailure={(response) => {
          console.log("Google Login Failure:", response);
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GLogin;
