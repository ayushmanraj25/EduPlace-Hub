import React, { useEffect, useState } from "react";
import FileUploadForm from "../components/admin/FileUploadForm";
import TextNoteForm from "../components/admin/TextNoteForm";

function Dashboard() {
  const [userNotes, setUserNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("myNotes");

  const availableSubjects = [
    "Data Structures", "DBMS", "Operating System", "Computer Networks",
    "AI & ML", "Object Oriented Programming", "Software Engineering",
    "Web Development", "Compiler Design", "Theory of Computation",
    "Cloud Computing", "Cyber Security", "Discrete Mathematics",
    "Digital Electronics", "Computer Architecture"
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
    if (storedUser) {
      fetchUserNotes(storedUser.email);
    }
  }, []);

  const fetchUserNotes = async (email) => {
    setLoading(true);
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        fetch(`http://localhost:5001/api/notes/user/${email}`),
        fetch(`http://localhost:5001/api/pending/user/${email}`)
      ]);
      const approvedData = await approvedRes.json();
      const pendingData = await pendingRes.json();
      
      const approved = Array.isArray(approvedData) 
        ? approvedData
            .map(n => ({...n, isApproved: true}))
            .filter(n => n.subject && n.subject.toUpperCase() !== "AI SYNTHESIS") 
        : [];
        
      const pending = Array.isArray(pendingData) 
        ? pendingData
            .map(n => ({...n, isApproved: false}))
            .filter(n => n.subject && n.subject.toUpperCase() !== "AI SYNTHESIS")
        : [];

      // Sort combined by date descending
      const combined = [...approved, ...pending].sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
      
      setUserNotes(combined);
    } catch (err) {
      console.error("Failed to fetch user notes", err);
    } finally {
      setLoading(false);
    }
  };

  const updateNotesList = () => {
    if (user) {
      fetchUserNotes(user.email);
    }
  };

  if (!user) return <div style={{ padding: "40px", textAlign: "center" }}>Please log in to view your dashboard.</div>;

  return (
    <div className="page-container" style={{ padding: "40px 20px" }}>
      <div className="animate-slide-up">
        <h1 style={{ fontSize: "32px", color: "var(--text-primary)", marginBottom: "8px" }}>
          Welcome back, {user.name || user.email.split("@")[0]}!
        </h1>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px" }}>
          Manage your uploaded notes and track their approval status.
        </p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <button
            className={activeTab === "myNotes" ? "primary-btn" : "secondary-btn"}
            onClick={() => setActiveTab("myNotes")}
            style={{ padding: "10px 20px", borderRadius: "8px" }}
          >
            My Uploaded Notes
          </button>
          <button
            className={activeTab === "upload" ? "primary-btn" : "secondary-btn"}
            onClick={() => setActiveTab("upload")}
            style={{ padding: "10px 20px", borderRadius: "8px" }}
          >
            Upload New Note
          </button>
        </div>

        {activeTab === "myNotes" ? (
          <div className="glass-panel" style={{ padding: "30px", background: "var(--bg-secondary)" }}>
            <h2 style={{ fontSize: "20px", color: "var(--text-primary)", marginBottom: "20px" }}>My Notes</h2>
            
            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Loading your notes...</p>
            ) : userNotes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "16px" }}>You haven't uploaded any notes yet.</p>
                <button className="primary-btn" onClick={() => setActiveTab("upload")}>Upload your first note</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {userNotes.map((note) => (
                  <div key={note._id} style={{
                    background: "var(--bg-primary)",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid var(--glass-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--accent-primary)", textTransform: "uppercase" }}>{note.subject}</span>
                      {note.isApproved ? (
                        <span style={{ fontSize: "11px", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "4px 8px", borderRadius: "20px", fontWeight: "bold" }}>Approved ✅</span>
                      ) : (
                        <span style={{ fontSize: "11px", background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", padding: "4px 8px", borderRadius: "20px", fontWeight: "bold" }}>Pending ⏳</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "16px", color: "var(--text-primary)", margin: "0" }}>
                      {note.topic || note.question}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", flex: 1, margin: "0" }}>
                      {note.content ? note.content.substring(0, 100) : note.answer ? note.answer.substring(0, 100) : ""}
                      {(note.content?.length > 100 || note.answer?.length > 100) ? "..." : ""}
                    </p>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                      <span>{new Date(note.createdAt || note.created_at).toLocaleDateString()}</span>
                      <span style={{ textTransform: "capitalize", fontWeight: "bold", opacity: 0.7 }}>{note.type || "Note"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            <div style={{ background: "var(--bg-secondary)", borderRadius: "16px", overflow: "hidden" }}>
               <TextNoteForm user={user} setNotesList={() => { updateNotesList(); setActiveTab("myNotes"); }} availableSubjects={availableSubjects} />
            </div>
            <div style={{ background: "var(--bg-secondary)", borderRadius: "16px", overflow: "hidden" }}>
               <FileUploadForm user={user} setNotesList={() => { updateNotesList(); setActiveTab("myNotes"); }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
