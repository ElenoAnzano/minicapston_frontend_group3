import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // to detect error vs success

  const navigate = useNavigate();

  // This useEffect triggers the alert ONLY when there's an error message
  useEffect(() => {
    if (message && isError) {
      // Small delay so the UI renders first
      const timer = setTimeout(() => {
        alert(message);
      }, 100);
      return () => clearTimeout(timer); // cleanup
    }
  }, [message, isError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    // Client validation
    if (studentId.length !== 8 || isNaN(Number(studentId))) {
      setMessage("ID must be exactly 8 digits");
      setIsError(true);
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setIsError(true);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idNumber: studentId.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully! Redirecting...");
        setIsError(false);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errorMsg = data.message || "Registration failed";
        setMessage(errorMsg);
        setIsError(true); // This triggers the alert!
      }
    } catch (err) {
      setMessage("Cannot connect to server. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img src="/logo.png" alt="Logo" className="logo" />

        <h2 style={{ color: "white", marginBottom: "20px" }}>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="8-digit Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))}
            maxLength={8}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <p className="signup-text" style={{ textAlign: "center", color:"#353333ff", marginTop: "20px" }}>
  Already have an account?{" "}
  <Link
    to="/login"
    style={{
      color: "#002fffff",
      textDecoration: "none",
      fontWeight: "600",
      transition: "all 0.3s ease",  // smooth hover
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = "#ffffffff";
      e.currentTarget.style.textDecoration = "underline";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = "#002fffff";
      e.currentTarget.style.textDecoration = "none";
    }}
  >
    Login here
  </Link>
</p>
      </div>
    </div>
  );
}

export default Signup;