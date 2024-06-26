import React, { useState } from "react";
import "./ModalLoginGPT.css"; // Assuming you save the CSS in a file named Login.css

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActive(true);
    }, 2200);
  };

  return (
    <div
      className={`login ${loading ? "loading" : ""} ${active ? "active" : ""}`}
    >
      <div className="form">
        <h2>Hello User</h2>
        <div className="form-field">
          <label htmlFor="login-mail">
            <i className="fa fa-user"></i>
          </label>
          <input
            id="login-mail"
            type="text"
            name="mail"
            placeholder="E-Mail"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            required
          />
          <svg>
            <use href="#svg-check" />
          </svg>
        </div>
        <div className="form-field">
          <label htmlFor="login-password">
            <i className="fa fa-lock"></i>
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="Password"
            pattern=".{6,}"
            required
          />
          <svg>
            <use href="#svg-check" />
          </svg>
        </div>
        <button type="submit" className="button" onClick={handleClick}>
          <div className="arrow-wrapper">
            <span className="arrow"></span>
          </div>
          <p className="button-text">SIGN IN</p>
        </button>
      </div>
      <div className="finished">
        <svg>
          <use href="#svg-check" />
        </svg>
      </div>
    </div>
  );
};

export default Login;
