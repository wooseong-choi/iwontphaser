// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextAnimation from "../components/TextAnimation";
import ModalLogin from "../components/ModalLogin";
import ModalLoginGPT from "../components/ModalLoginGPT";
import "../static/css/Login.css";
import Header from "../components/Header";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/main");
  };

  return (
    <>
      <div
        id="background"
        className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      >
        <Header />
        <TextAnimation />
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
          <ModalLoginGPT />
          <ModalLogin isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default Login;
