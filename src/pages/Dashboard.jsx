import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  // Load events from backend
  useEffect(() => {
  const loadEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard");
      const data = await res.json();
      const transformed = data.map(item => ({
        date: item.date,
        items: typeof item.items == "string" 
          ? item.items.split(",").map(s => s.trim()) 
          : item.items
      }));
      setEvents(transformed);
    } catch (err) {
      console.error(err);
    }
  };
  loadEvents();
}, []);


  const colors = [
    "#E3F2FD", "#FFF3E0", "#E8F5E9", "#F3E5F5",
    "#FFEBEE", "#E0F7FA", "#FFF8E1", "#FCE4EC",
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-subtitle">Upcoming Events</h2>

        {events.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No events yet.</p>
        ) : (
          <div className="event-list">
            {events.map((event, index) => (
              <div
                key={index}
                className="event-column"
                style={{ backgroundColor: colors[index % colors.length] }}
              >
                <h3>{event.date}</h3>
                <ul>
                  {event.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
