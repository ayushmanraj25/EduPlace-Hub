import React from "react";

function SessionActivity({ notesList }) {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div style={{ flex: "1 1 500px" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "var(--text-primary)" }}>Session Activity</h3>

      {notesList.length === 0 ? (
        <div className="glass-panel animate-fade-in" style={{ padding: "40px", textAlign: "center", borderStyle: "dashed", borderColor: "var(--glass-border)" }}>
          <span style={{ fontSize: "40px", display: "block", marginBottom: "10px", opacity: 0.5 }}>📝</span>
          <p style={{ color: "var(--text-muted)" }}>No notes or files uploaded in this session.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {notesList.map((item, index) => (
            <div
              key={index}
              className="glass-panel animate-slide-up"
              style={{
                padding: "20px",
                borderLeft: `4px solid ${
                  item.type === "file" ? "var(--accent-secondary)" : item.type === "placement" ? "var(--warning)" : "var(--success)"
                }`,
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h4 style={{ color: "var(--accent-primary)", margin: 0 }}>{item.subject}</h4>
                <span
                  style={{
                    background: item.type === "file" ? "rgba(255, 119, 51, 0.1)" : "rgba(16, 185, 129, 0.1)",
                    color: item.type === "file" ? "var(--accent-secondary)" : item.type === "placement" ? "var(--warning)" : "var(--success)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {item.type === "file" ? "📎 File" : item.type === "placement" ? "💼 Q&A" : "✓ Text"}
                </span>
              </div>
              <strong style={{ display: "block", fontSize: "18px", color: "var(--text-primary)", marginBottom: "8px" }}>{item.topic}</strong>
              {item.type === "file" ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
                  {item.fileName} ({formatFileSize(item.fileSize)})
                </p>
              ) : (
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", whiteSpace: "pre-wrap", margin: 0, opacity: 0.8 }}>
                  {item.note.length > 150 ? item.note.substring(0, 150) + "..." : item.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SessionActivity;
