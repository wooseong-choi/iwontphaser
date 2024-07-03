// src/pages/Login.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import ModalLogin from "../components/ModalLogin";
import TextAnimation from "../components/TextAnimation";
import ModalRegist from "../components/ModalRegist";

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistOpen, setIsRegistOpen] = useState(false);

  return (
    <>
      <div
        id="background"
        className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      >
        <Header />
        {/* <TextAnimation /> */}
        <div>
          <button
            onClick={() => {
              // Open the login modal
              setIsOpen(isOpen === false ? true : false);
            }}
            className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gree-600"
          >
            Join to the World!
          </button>
          <span
            onClick={() => {
              setIsRegistOpen(isRegistOpen === false ? true : false);
            }}
            style={{
              display: "block",
              cursor: "pointer",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            회원가입
          </span>
          <ModalLogin isOpen={isOpen} onClose={() => setIsOpen(false)} />
          <ModalRegist
            isRegistOpen={isRegistOpen}
            onClose={() => setIsRegistOpen(false)}
          />
        </div>
      </div>
    </>
  );
};

export default Login;
