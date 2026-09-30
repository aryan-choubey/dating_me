import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import logo from "../assets/logo/logo.png";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar_logo">
        <img src={logo} alt="SoulSpark Logo" />
      </div>

      {/* Navigation */}
      <nav className="sidebar_nav">

        <NavLink
          to="/discover"
          className={({ isActive }) =>
            `sidebar_item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar_icon">⌕</span>
          <span>Discover</span>
        </NavLink>

         <NavLink
          to="/likes"
          className={({ isActive }) =>
            `sidebar_item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar_icon">♡</span>
          <span>Likes</span>
        </NavLink>

        <NavLink
          to="/matches"
          className={({ isActive }) =>
            `sidebar_item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar_icon">♡</span>
          <span>Matches</span>
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `sidebar_item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar_icon">☵</span>
          <span>Messages</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar_item ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar_icon">♙</span>
          <span>Profile</span>
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;