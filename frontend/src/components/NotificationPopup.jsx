import React, { useState, useEffect } from "react";

const NotificationPopup = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mocking real-time updates for demonstration
    const activities = [
      { id: 1, type: "note", content: "New DBMS notes uploaded by Admin" },
      { id: 2, type: "placement", content: "Technical Q&A added for SQL Joins" },
      { id: 3, type: "ai", content: "Neural Net synthesized 'B-Tree' summary" },
      { id: 4, type: "user", content: "Student logged in from University IP" },
    ];

    let count = 0;
    const interval = setInterval(() => {
      const activity = activities[count % activities.length];
      const newNotify = { ...activity, timestamp: Date.now() };
      
      setNotifications((prev) => [newNotify, ...prev].slice(0, 3));
      count++;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed",
      bottom: "30px",
      right: "30px",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      pointerEvents: "none"
    }}>
      {notifications.map((n, idx) => (
        <div
          key={n.timestamp}
          className="glass-panel animate-slide-up"
          style={{
            padding: "16px 20px",
            minWidth: "280px",
            maxWidth: "350px",
            background: "rgba(255, 255, 255, 0.95)",
            borderLeft: `5px solid ${n.type === 'note' ? 'var(--accent-primary)' : n.type === 'placement' ? 'var(--warning)' : 'var(--success)'}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            pointerEvents: "auto",
            animation: "popup-entrance 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            opacity: 1 - (idx * 0.2),
            transform: `scale(${1 - (idx * 0.05)}) translateY(${idx * 10}px)`,
          }}
        >
          <div style={{ fontSize: "20px" }}>
            {n.type === 'note' ? '📝' : n.type === 'placement' ? '💼' : '✨'}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>{n.content}</p>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>Just now • Live Update</p>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes popup-entrance {
          from { transform: translateX(50px) scale(0.9); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NotificationPopup;
