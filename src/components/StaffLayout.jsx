import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaCalendarAlt,
  FaComments,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "./StaffLayout.css";

function StaffLayout() {
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID") || "Unknown";

  const handleSignOut = () => {
    if (window.socketRef?.current?.connected) {
      window.socketRef.current.disconnect();
      window.socketRef.current = null;}

      localStorage.removeItem("userID");
      localStorage.removeItem("currentUserId");
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
          <NavLink to="/staff/home" className="menu-item">
            <FaHome className="icon" /> Home
          </NavLink>
          <NavLink to="/staff/dashboard" className="menu-item">
            <FaChartBar className="icon" /> Dashboard
          </NavLink>
          <NavLink to="/staff/calendar" className="menu-item">
            <FaCalendarAlt className="icon" /> Calendar
          </NavLink>
          <NavLink to="/staff/concerns" className="menu-item">
            <FaComments className="icon" /> Students Concerns
          </NavLink>
          <NavLink to="/staff/profile" className="menu-item">
            <FaUser className="icon" /> Profile
          </NavLink>
        </nav>

        <div className="signout">
          <button className="menu-item signout-item" onClick={handleSignOut}>
            <FaSignOutAlt className="icon" /> Sign out
          </button>
        </div>
      </aside>

      {/* Outlet for content */}
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}

export default StaffLayout;
