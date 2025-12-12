import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "./StaffCalendar.css";

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`);
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


  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const renderCalendar = () => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter(e => e.date === dayStr);

      days.push(
        <div
          key={day}
          className={`day ${dayEvents.length > 0 ? "has-event" : ""}`}
          onClick={() => setSelectedDate({ date: dayStr, events: dayEvents })}
        >
          <span>{day}</span>
          {dayEvents.length > 0 && <div className="dot"></div>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-page">
      <h1 className="calendar-header"><FaCalendarAlt /> Calendar</h1>

      <div className="calendar-card">
        <div className="month-year-selector">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
          >
            {months.map((month, i) => (
              <option key={month} value={i}>{month}</option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <h2 className="month-title">{months[currentMonth]} {currentYear}</h2>

        <div className="calendar-grid">
          <div className="weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>

          <div className="days-grid">{renderCalendar()}</div>
        </div>
      </div>

      {/* 🟢 Event Popup */}
      {selectedDate && (
        <div className="event-popup">
          <div className="popup-content">
            <h3>{selectedDate.dateStr}</h3>
            {selectedDate.events.length > 0 ? (
              <ul>
                {selectedDate.events.map((e, i) =>
                  e.items.map((item, j) => <div key={`${i}-${j}`}>{item}</div>)
                )}
              </ul>
            ) : (
              <p>No events</p>
            )}
            <button onClick={() => setSelectedDate(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
