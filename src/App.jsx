import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Forgotpassword";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import StudentConcerns from "./pages/StudentConcerns";
import Profile from "./pages/Profile";
import Layout from "./components/Layout"; // for users
import StaffLayout from "./components/StaffLayout"; // for staff


// ✅ Import your Staff pages here
import StaffHome from "./pages/Staff/StaffHome";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffCalendar from "./pages/Staff/StaffCalendar";
import StaffConcerns from "./pages/Staff/StaffConcerns";
import StaffProfile from "./pages/Staff/StaffProfile";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER ROUTES */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/concerns" element={<StudentConcerns />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* STAFF ROUTES */}
        <Route element={<StaffLayout />}>
          <Route path="/staff/home" element={<StaffHome />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/calendar" element={<StaffCalendar />} />
          <Route path="/staff/concerns" element={<StaffConcerns />} />
          <Route path="/staff/profile" element={<StaffProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
