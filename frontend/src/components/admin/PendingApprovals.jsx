import React, { useEffect, useState } from "react";

function PendingApprovals() {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingNotes = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/pending");
      const data = await res.json();
      setPendingNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching pending notes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNotes();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/pending/${id}/approve`, {
        method: "PUT"
      });
      if (res.ok) {
        setPendingNotes(prev => prev.filter(note => note.id !== id && note.id !== Number(id)));
        alert("Item approved and published! ✅");
      } else {
        alert("Failed to approve item");
      }
    } catch (error) {
      console.error(error);
      alert("Error approving item");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/pending/${id}/reject`, {
        method: "DELETE"
      });
      if (res.ok) {
        setPendingNotes(prev => prev.filter(note => note.id !== id && note.id !== Number(id)));
        alert("Item rejected and deleted ❌");
      } else {
        alert("Failed to reject item");
      }
    } catch (error) {
      console.error(error);
      alert("Error rejecting item");
    }
  };

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Loading pending approvals...</p>;

  return (
    <div className="glass-panel animate-slide-up" style={{ padding: "24px", background: "var(--bg-secondary)", borderRadius: "16px", marginBottom: "40px" }}>
      <h3 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>⏳</span> Pending User Approvals
      </h3>
      {pendingNotes.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>No pending items to review.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {pendingNotes.map(note => (
            <div key={note.id} style={{
              background: "var(--bg-primary)",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid var(--glass-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap"
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", background: "var(--bg-tertiary)", color: "var(--text-secondary)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", textTransform: "uppercase" }}>
                    Type: {note.type || "Note"}
                  </span>
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--accent-primary)", textTransform: "uppercase" }}>
                    {note.subject || note.category || note.company}
                  </div>
                </div>
                <h4 style={{ margin: "0 0 8px 0", color: "var(--text-primary)", fontSize: "16px" }}>{note.topic || note.question}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {note.content || note.answer}
                </p>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
                  Uploaded by: <strong>{note.user_id}</strong> on {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  onClick={() => handleApprove(note.id)}
                  style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "1px solid #10B981", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Approve ✓
                </button>
                <button 
                  onClick={() => handleReject(note.id)}
                  style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid #EF4444", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Reject ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingApprovals;
