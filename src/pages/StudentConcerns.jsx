import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./StudentConcerns.css";

const StudentConcerns = () => {
  const [allStaff, setAllStaff] = useState([]);
  const [onlineStaff, setOnlineStaff] = useState(new Set());
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const userId = localStorage.getItem("currentUserId");
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:5000", {
      query: { userId },
      transports: ["websocket"],
      forceNew: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Student connected");
    });

    socket.on("staff_status_update", (data) => {
      setAllStaff(data.allStaff || []);
      setOnlineStaff(new Set(data.onlineStaffIds || []));
    });

    socket.on("load_messages", (history) => {
      setMessages(history || []);
      scrollToBottom();
    });

    socket.on("receive_message", (msg) => {
      // Only add if it's in the current chat OR if no chat is open
      if (!selectedStaff || msg.senderId === selectedStaff.id || msg.receiverId === userId) {
        setMessages((prev) => {
          // Prevent exact duplicates
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } else if (msg.sender === "staff") {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const openChat = (staff) => {
    setSelectedStaff(staff);
    setMessages([]);
    socketRef.current?.emit("open_private_chat", staff.id);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedStaff) return;

    socketRef.current?.emit("send_private_message", {
      text: newMessage.trim(),
      to: selectedStaff.id,
    });

    setNewMessage("");
  };

  return (
    <div className="chat-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Support Staff</h2>
        </div>
        <div className="staff-list">
          {allStaff.map((staff) => {
            const isOnline = onlineStaff.has(staff.id);
            const name = staff.username || staff.idNumber || "Staff";

            return (
              <div
                key={staff.id}
                className={`staff-item ${selectedStaff?.id === staff.id ? "active" : ""}`}
                onClick={() => openChat(staff)}
              >
                <div className="avatar-wrapper">
                  <img
                    src={staff.userImg || "/default-profile.png"}
                    alt={name}
                    onError={(e) => (e.currentTarget.src = "/default-profile.png")}
                  />
                  {isOnline && <div className="online-ring"></div>}
                </div>

                <div className="staff-info">
                  <div className="staff-name">
                    <span className="name-text"> {name}</span>
                  </div>
                </div>

                {/* Red badge */}
                {(unreadCounts[staff.id] || 0) > 0 && (
                  <div className="unread-badge">
                    {unreadCounts[staff.id] > 99 ? "99+" : unreadCounts[staff.id]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedStaff ? (
          <>
            <div className="chat-header">
              <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Avatar with online dot */}
                <div className="avatar large" style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={selectedStaff.userImg || "/default-profile.png"}
                    alt={selectedStaff.username || selectedStaff.idNumber}
                    onError={(e) => (e.currentTarget.src = "/default-profile.png")}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {onlineStaff.has(selectedStaff.id) && (
                    <span className="online-dot large" />
                  )}
                </div>

                {/* Name — perfectly aligned next to avatar */}
                <h3 className="header-name" style={{ margin: 0, textAlign: 'left', fontSize: '18px', fontWeight: '600' }}>
                  {selectedStaff.username || selectedStaff.idNumber || "Staff"}
                </h3>
              </div>
            </div>

            <div className="chat-body">
              {messages.length === 0 ? (
                <div className="empty-chat">Start your conversation...</div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`message-bubble ${m.sender === "student" ? "sent" : "received"}`}
                  >
                    <p>{m.text}</p>
                    <span className="time">
                      {new Date(m.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
              <input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="welcome-screen">
            <h2>Select a staff member to chat</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentConcerns;