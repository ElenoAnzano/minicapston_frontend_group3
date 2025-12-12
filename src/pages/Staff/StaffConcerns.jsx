import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./StaffConcerns.css";

const StaffConcerns = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = localStorage.getItem("currentUserId");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesRef = useRef([]);
  const selectedRef = useRef(null);
  const [messagesMap, setMessagesMap] = useState({});


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || `${import.meta.env.VITE_API_URL}`, {
      query: { userId },
      transports: ["websocket"],
    });

    socketRef.current = socket;
     

    socket.on("connect", () => {
      console.log("Staff connected:", userId);
      socket.emit("staff_request_conversations");
    });

    socket.on("staff_conversations_list", (list) => {
  const sorted = (list || []).sort((a, b) => new Date(b.time) - new Date(a.time));
  setConversations(sorted);

  // Join private rooms for all existing conversations
  sorted.forEach(student => {
    socket.emit("open_private_chat", student.studentId);
  });

  if (!selectedStudent && sorted.length > 0) {
    setSelectedStudent(sorted[0]);
  }
});
    
  
    socket.on("load_messages", (history) => {
      const current = messagesRef.current;
       
      if (current.length > 0 && history.length <= current.length) {return;}

       setMessages(history || []);
      setTimeout(scrollToBottom, 100);
    });

    socket.on("receive_message", (msg) => {
  const studentId = msg.senderId === userId ? msg.receiverId : msg.senderId;

  // Update conversation list
  setConversations(prev => {
    let exists = false;
    const updated = prev.map(c => {
      if (c.studentId === studentId) {
        exists = true;
        return {
          ...c,
          lastMessage: msg.text,
          time: msg.time,
          unread: msg.sender === "student" && selectedRef.current?.studentId !== studentId
            ? (c.unread || 0) + 1
            : c.unread || 0,
        };
      }
      return c;
    });

    // Only add new conversation if it doesn't exist
    if (!exists && msg.sender === "student") {
      updated.unshift({
        studentId,
        name: msg.senderName || "Student",
        photo: msg.senderPhoto || "/default-profile.png",
        lastMessage: msg.text,
        time: msg.time,
        unread: 0,
      });
    }

    return updated.sort((a, b) => new Date(b.time) - new Date(a.time));
  });

  // Store messages in messagesMap (avoid duplicates)
  setMessagesMap(prev => {
    const prevMessages = prev[studentId] || [];
    if (msg.id && prevMessages.some(m => m.id === msg.id)) return prev;
    return { ...prev, [studentId]: [...prevMessages, msg] };
  });

  // Update current chat if open
  if (selectedRef.current?.studentId === studentId) {
    setMessages(prev => {
      if (msg.id && prev.some(m => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    scrollToBottom();
  }
});


    return () => socket.disconnect();
  }, []);

  useEffect(() => {
  messagesRef.current = messages;
}, [messages]);

  useEffect(() => {
    if (selectedStudent && socketRef.current) {
      socketRef.current.emit("open_private_chat", selectedStudent.studentId);
    }
  }, [selectedStudent]);

  useEffect(() => {
  selectedRef.current = selectedStudent;
}, [selectedStudent]);


  const openChat = (student) => {

    setSelectedStudent(student);

    // Load messages from messagesMap
    setMessages(messagesMap[student.studentId] || []);

    // Reset unread
    setConversations(prev =>
      prev.map(c => c.studentId === student.studentId ? { ...c, unread: 0 } : c));

    // Open private chat
    socketRef.current?.emit("open_private_chat", student.studentId);
  };

  const sendMessage = () => {
  if (!newMessage.trim() || !selectedStudent) return;

  const text = newMessage.trim();
  setNewMessage("");

  // 1. Make sure both you and the student are in the private room
  socketRef.current?.emit("open_private_chat", selectedStudent.studentId);

  // 2. Show your message instantly on your screen
  const tempMessage = {
    id: "temp-" + Date.now(),
    senderId: userId,
    receiverId: selectedStudent.studentId,
    text,
    time: new Date().toISOString(),
    sender: "staff",
    senderName: "You",           // optional, looks nice
    senderPhoto: "/default-profile.png"  // optional
  };

  
  scrollToBottom();

  // 3. Update the sidebar preview instantly
  setConversations((prev) =>
    prev.map((c) =>
      c.studentId === selectedStudent.studentId
        ? { ...c, lastMessage: text, time: new Date() }
        : c
    )
  );

  // 4. Send the real message to the server
  socketRef.current?.emit("send_private_message", {
    text,
    to: selectedStudent.studentId,
  });
};
  return (
    <div className="chat-wrapper">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Student Messages</h2>
        </div>
        <div className="student-list">
          {conversations.length === 0 ? (
            <div className="no-chat">No messages yet</div>
          ) : (
            conversations.map((student) => (
              <div
                key={student.studentId}
                className={`student-item ${selectedStudent?.studentId === student.studentId ? "active" : ""}`}
                onClick={() => openChat(student)}
              >
                <img src={student.photo} alt="" className="avatar" />
                <div className="info">
                  <div className="name">{student.name}</div>
                </div>
                {student.unread > 0 && <span className="unread">{student.unread}</span>}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-area">
        {selectedStudent ? (
          <>
            <div className="chat-header">
              <img src={selectedStudent.photo} alt="" className="header-avatar" />
              <h3>{selectedStudent.name}</h3>
            </div>
            <div className="messages">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`bubble ${m.senderId === userId ? "sent" : "received"}`}
                >
                  <p>{m.text}</p>
                  <span className="time">
                    {new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
              <input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="empty">Select a student to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default StaffConcerns;