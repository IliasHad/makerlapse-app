import React from "react";

export const Layout = ({ children }) => {
  return (
    <div className="container">
      <main>{children}</main>
    </div>
  );
};
