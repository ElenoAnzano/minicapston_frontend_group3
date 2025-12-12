import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [id, setId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleFindAccount = async (e) => {
    e.preventDefault();

    if (id.length !== 8 || isNaN(Number(id))) {
      alert("Please enter a valid 8-digit Student ID");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idNumber: id.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2); // Go to password change step
      } else {
        alert(data.message || "ID not found");
      }
    } catch (err) {
      alert("Cannot connect to server. Please try again later.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idNumber: id.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully!\nRedirecting to login...");
        setTimeout(() => navigate("/login"), 300);
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          {step === 1 ? "Reset Password" : "Set New Password"}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleFindAccount}>
            <input
              type="text"
              placeholder="8-digit Student ID"
              value={id}
              onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
              maxLength={8}
              required
            />
            <button type="submit">Next</button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Change Password</button>
          </form>
        )}
        <p style={{ marginTop: "20px" }}>
          <Link to="/login" style={{color: "#4da8ff",
      textDecoration: "none",
      fontWeight: "600",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = "#ffffff";
      e.currentTarget.style.textDecoration = "underline";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = "#4da8ff";
      e.currentTarget.style.textDecoration = "none";}}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;