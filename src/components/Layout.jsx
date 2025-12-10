import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaCalendarAlt,
  FaUsers,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID") || "Unknown";

  const handleSignOut = () => {
    localStorage.removeItem("userID");
    navigate("/");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="user-id">ID: {userID}</p>
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/home" className="menu-item">
            <FaHome className="icon" /> Home
          </NavLink>
          <NavLink to="/dashboard" className="menu-item">
            <FaChartBar className="icon" /> Dashboard
          </NavLink>
          <NavLink to="/calendar" className="menu-item">
            <FaCalendarAlt className="icon" /> Calendar
          </NavLink>
          <NavLink to="/concerns" className="menu-item">
            <FaUsers className="icon" /> Staff
          </NavLink>
          <NavLink to="/profile" className="menu-item">
            <FaUser className="icon" /> Profile
          </NavLink>
        </nav>

        <div className="signout">
          <button className="menu-item signout-item" onClick={handleSignOut}>
            <FaSignOutAlt className="icon" /> Sign out
          </button>
        </div>
      </aside>

      {/* Outlet content */}
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
