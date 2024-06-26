import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header" id="header">
      <div className="inner">
        <h1 className="logo">
          <Link to="/">
            <img
              src="https://jungle.krafton.com/resource/images/common/logo.svg"
              alt="jungle"
            />
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default Header;
