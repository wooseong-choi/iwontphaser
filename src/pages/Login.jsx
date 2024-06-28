// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('ws://localhost:3001');

    socket.on('connect', function() {
      console.log('Socket.IO connected.');
      // socket.emit('join', {username: 'testuser'});
    });

    socket.on('message', function(data) {
      console.log('Received: ' + data);
    });

    socket.on('disconnect', function() {
      console.log('Socket.IO disconnected.');
    });

    socket.on('error', function(error) {
      console.log('Socket.IO Error: ' + error);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = form.username;
    // alert(form.username);
    if (socket && socket.connected) {
      socket.emit('join', {username: username});
    }
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
              console.log(`isOpen: ${isOpen}`);
            }}
            className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gree-600"
          >
            Join to the World!
          </button>
          <ModalLogin isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default Login;
