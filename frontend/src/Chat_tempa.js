import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Chat.css";

export default function Chat({ user, onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [currentConvoId, setCurrentConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // New: Loading state
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      const res = await fetch(`http://localhost:8000/sessions/${user.id}`);
      const data = await res.json();
      setSessions(data);
      
      // Select the first session if none is active
      if (data.length > 0 && !currentConvoId) {
        setCurrentConvoId(data[0].id);
      } 
      else if (data.length === 0) {
        createNewSession();
      }
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  };

  useEffect(() => { fetchSessions(); }, [user.id]);

  // Load history when convo changes
  useEffect(() => {
    if (currentConvoId) {
      fetch(`http://localhost:8000/history/${currentConvoId}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error("History error", err));
    }
  }, [currentConvoId]);

  const createNewSession = async () => {
    const res = await fetch(`http://localhost:8000/new_conversation/${user.id}`, { method: "POST" });
    const data = await res.json();
    setCurrentConvoId(data.conversation_id);
    setMessages([]);
    fetchSessions();
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentConvoId || isTyping) return;

    const userMsg = { role: "user", content: input };
    const updatedMsgs = [...messages, userMsg];
    
    setMessages(updatedMsgs);
    setInput("");
    setIsTyping(true); // Start "AI is thinking" animation

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMsgs, 
          user_id: Number(user.id), 
          conversation_id: Number(currentConvoId) 
        }),
      });

      if (!res.ok) throw new Error("Chat failed");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setIsTyping(false); // Stop "AI is thinking"
    }
  };

  return (
    <div className="glass-chat-wrapper">
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="sidebar"
      >
        <div className="sidebar-header">
          <h2>🌱 Sessions</h2>
          <button className="new-chat-plus" onClick={createNewSession}>+</button>
        </div>
        <div className="session-list">
          {sessions.map((s, index) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={s.id} 
              // Logical ID is 's.id', but UI displays 'index + 1'
              className={`session-pill ${currentConvoId === s.id ? "active" : ""}`}
              onClick={() => setCurrentConvoId(s.id)}
            >
              Session #{index + 1}
            </motion.div>
          ))}
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </motion.div>

      <div className="chat-main">
        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>Hello {user.username}. How can I support you today?</p>
            </div>
          )}
          <AnimatePresence mode='popLayout'>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`bubble-wrapper ${m.role}`}
              >
                <div className="message-bubble">{m.content}</div>
              </motion.div>
            ))}
            
            {/* Visual Indicator for AI thinking */}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bubble-wrapper assistant"
              >
                <div className="message-bubble typing-dots">...</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        <div className="input-container">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={isTyping ? "AI is thinking..." : "Type your reflection..."}
            disabled={isTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={!currentConvoId || isTyping}>
            {isTyping ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

// Mapping moods to numerical values for the graph
const moodMap = { "Sad": 1, "Anxious": 2, "Neutral": 3, "Productive": 4, "Calm": 5 };

const Sidebar = ({ sessions, onDelete, onSelect, currentId }) => {
  // Prepare data for the trend graph
  const chartData = sessions.slice(-7).map(s => ({
    moodValue: moodMap[s.mood] || 3
  }));

  return (
    <div className="sidebar">
      <h2>History</h2>
      <div className="session-list">
        {sessions.map(s => (
          <div key={s.id} className={`session-item ${currentId === s.id ? 'active' : ''}`}>
            <span onClick={() => onSelect(s.id)}>
              {s.mood === "Calm" ? "🌿" : "💬"} {s.title}
            </span>
            <button className="delete-icon" onClick={() => onDelete(s.id)}>🗑️</button>
          </div>
        ))}
      </div>

      {/* Mood Trend Graph Section */}
      <div className="mood-trend">
        <h4>7-Day Trend</h4>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="moodValue" stroke="#81c784" strokeWidth={2} dot={false} />
            <YAxis hide domain={[1, 5]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};