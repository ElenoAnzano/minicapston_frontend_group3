import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./StaffDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;

const StaffDashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ date: "", items: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const colors = [
    "#E3F2FD", "#FFF3E0", "#E8F5E9", "#F3E5F5",
    "#FFEBEE", "#E0F7FA", "#FFF8E1", "#FCE4EC",
  ];

  // Load all events from backend
  const loadEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard`);
      const data = await res.json();

      const transformed = data.map(item => ({
        id: item.id,
        date: item.date,
        items: typeof item.items == "string"
          ? item.items.split(",").map(s => s.trim()).filter(Boolean)
          : Array.isArray(item.items)
            ? item.items
            : []
      }));

      setEvents(transformed);
    } catch (err) {
      console.error("Failed to load events:", err);
      alert("Failed to connect to backend — is it running?");
    }
  };

  // Add New Event
  const handleAddEvent = async () => {
    if (!newEvent.date || !newEvent.items.trim()) {
      return alert("Please fill both date and items!");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newEvent.date,
          items: newEvent.items.trim(),
        }),
      });

      if (res.ok) {
        setNewEvent({ date: "", items: "" });
        await loadEvents();
        alert("Event added successfully!");
      } else {
        const error = await res.text();
        alert("Failed to add: " + error);
      }
    } catch (err) {
      alert("Network error or backend is not running");
    } finally {
      setLoading(false);
    }
  };

  // Edit Event
  const handleEditEvent = (event) => {
    setEditingId(event.id);
    setNewEvent({
      date: event.date,
      items: event.items.join(", "),
    });
  };

  // Save Edit
  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newEvent.date,
          items: newEvent.items.trim(),
        }),
      });

      if (res.ok) {
        setNewEvent({ date: "", items: "" });
        setEditingId(null);
        await loadEvents();
        alert("Event updated!");
      } else {
        alert("Failed to update event");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event permanently?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadEvents();
        alert("Event deleted!");
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-title">
        <h1>Staff Dashboard</h1>
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-subtitle">Upcoming Events</h2>

        <div className="event-list">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="event-column"
              style={{ backgroundColor: colors[index % colors.length] }}
            >
              <h3>{event.date}</h3>
              <ul>
                {event.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <div className="event-buttons">
                <button className="icon-btn edit-icon" onClick={() => handleEditEvent(event)}>
                  <FaEdit />
                </button>
                <button className="icon-btn delete-icon" onClick={() => handleDeleteEvent(event.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add or Edit Form */}
        <div className="add-event-form">
          <h3>{editingId ? "Edit Event" : "Add New Event"}</h3>

          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />

          <input
            type="text"
            placeholder="Items (comma separated)"
            value={newEvent.items}
            onChange={(e) => setNewEvent({ ...newEvent, items: e.target.value })}
          />

          {editingId ? (
            <button className="icon-btn save-icon" onClick={handleSaveEdit} disabled={loading}>
              Save
            </button>
          ) : (
            <button className="icon-btn add-icon" onClick={handleAddEvent} disabled={loading}>
              <FaPlus />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;