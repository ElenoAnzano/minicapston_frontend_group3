import React, { useEffect, useState } from "react";
import "./Home.css";

function Home() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("userID");
    const role = localStorage.getItem("role");

    // If not logged in → kick to login
    if (!id || !role) {
      window.location.href = "/login";
      return;
    }

    // Optional: make sure only students (or allowed roles) can access this page
    // Remove this block if faculty/staff should also see this home page
    if (role === "staff") {
      window.location.href = "/staff/home";
      return;
    }

    setUserId(id);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="main-content">Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="about-container">
        <h1>Welcome back!</h1>
        <p><strong>ID Number:</strong> {userId}</p>
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

export default Home;