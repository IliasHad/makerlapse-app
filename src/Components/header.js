import React from "react";

import { MdSettings, MdHome } from "react-icons/md";
import { Link } from "react-router-dom";

export const Header = ({ title, returnPath }) => {
  return (
    <header className="header__container">
      <div className="header__title">{title}</div>
      <div className="header__quick-options">
        <Link to={returnPath}>
          {returnPath === "/" ? <MdHome /> : <MdSettings />}
        </Link>
      </div>
    </header>
  );
};
