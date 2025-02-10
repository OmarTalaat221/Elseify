import React from "react";
import SideNav from "../sidenav";
import Header from "../header";
import "./style.css";
import Welcome from "../../components/welcome";

function DefaultLayout({ children }) {
  return (
    <div className="layout">
      <div className="horLayout">
        <SideNav />
        <div className="verticallayout">
          <Header />
          <div className="children">
            <Welcome />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
