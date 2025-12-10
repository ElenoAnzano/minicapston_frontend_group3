import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idNumber: id, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("currentUserId", data.user.id);

      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,           
        idNumber: data.user.idNumber,
        role: data.user.role
      }));

      
      localStorage.setItem("userID", data.user.idNumber);
      localStorage.setItem("role", data.user.role);

      // Redirect
      window.location.replace(
        data.user.role === "staff" ? "/staff/home" : "/home"
      );

    } catch (err) {
      setError("Cannot connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img src="/logo.png" alt="Logo" className="logo" />

        <h2 style={{ color: "white", marginBottom: "20px" }}>Welcome Back</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div style={{ 
              margin: "10px 0", 
              color: "#f71515ff", 
              fontSize: "14px", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center" 
            }}>
              <span>{error}</span>
              <Link to="/forgot-password" style={{ color: "#002fffff",
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
     }}>
                Forgot Password?
              </Link>
            </div>
          )}

          <button type="submit">Login</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
  Don’t have an account?{" "}
  <Link 
    to="/signup" 
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
    Sign up
  </Link>
</p>
      </div>
    </div>
  );
}

export default Login;