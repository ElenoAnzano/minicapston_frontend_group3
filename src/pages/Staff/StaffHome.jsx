import React, { useEffect, useState } from "react";
import "./StaffHome.css";

function StaffHome() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("userID");
    const userRole = localStorage.getItem("role");

    // If somehow not logged in → kick out immediately
    if (!id || !userRole) {
      window.location.href = "/login";
      return;
    }

    // Extra safety: prevent students from accessing staff page
    if (userRole !== "staff") {
      alert("Access denied. Staff only.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    setUserId(id);
    setRole(userRole);
    setLoading(false);
  }, []); // Runs every time page loads (because of window.location.href)

  if (loading) {
    return <div className="main-content">Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="about-container">
        <h1>Welcome back, Staff!</h1>
        <p><strong>ID Number:</strong> {userId}</p>
        <p><strong>Role:</strong> {role.charAt(0).toUpperCase() + role.slice(1)}</p>
        <br />

        <h2>About Us</h2><br />
        <p>
          Welcome to the <strong>Cordova Public College Event Tracking System</strong> — your all-in-one platform to stay updated with events and programs happening throughout the academic year.
        </p>
        <br />
        <p>
          Our mission is to keep students, faculty, and staff informed and involved in every important celebration, announcement, and school activity.
        </p>
        <br />
        <p>
          Whether you’re checking upcoming events or reviewing past ones, we make sure you’re always connected with the CPC community.
        </p>
      </div>
    </div>
  );
}

export default StaffHome;