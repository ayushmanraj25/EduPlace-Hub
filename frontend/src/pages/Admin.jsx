import { useState } from "react";
import TextNoteForm from "../components/admin/TextNoteForm";
import FileUploadForm from "../components/admin/FileUploadForm";
import PlacementForm from "../components/admin/PlacementForm";
import SessionActivity from "../components/admin/SessionActivity";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
function Admin() {
  const [notesList, setNotesList] = useState([]);
  const [activeTab, setActiveTab] = useState("text");

  const availableSubjects = [
    "Data Structures", "DBMS", "Operating System", "Computer Networks",
    "AI & ML", "Object Oriented Programming", "Software Engineering",
    "Web Development", "Compiler Design", "Theory of Computation",
    "Cloud Computing", "Cyber Security", "Discrete Mathematics",
    "Digital Electronics", "Computer Architecture"
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="page-container">
      <div className="animate-slide-up" style={{ marginBottom: "40px" }}>
        <h2 className="gradient-text" style={{ fontSize: "38px", marginBottom: "10px" }}>Admin Dashboard</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
          Manage platform content — upload text notes or PDF/document files.
        </p>
      </div>

      {/* Analytics Panel */}
      <div className="animate-slide-up delay-100" style={{ marginBottom: "40px", background: "var(--bg-secondary)", borderRadius: "16px", padding: "24px", border: "1px solid var(--glass-border)", display: 'flex', gap: '40px', flexWrap: 'wrap', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
        <div style={{ flex: '1 1 200px' }}>
          <h3 style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "16px", fontWeight: "600" }}>Key Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--card-highlight)', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-highlight-border)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '4px', textTransform: 'uppercase' }}>Total Students</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>1,480+</div>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3B82F6', marginBottom: '4px', textTransform: 'uppercase' }}>AI Quizzes Taken</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>890</div>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#F59E0B', marginBottom: '4px', textTransform: 'uppercase' }}>Content Items</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{notesList.length || 54}</div>
            </div>
          </div>
        </div>
        <div style={{ flex: '3 1 400px' }}>
          <h3 style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "16px", fontWeight: "600" }}>Weekly Engagement Overview</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', users: 120, quizzes: 45 },
                { name: 'Tue', users: 150, quizzes: 80 },
                { name: 'Wed', users: 200, quizzes: 120 },
                { name: 'Thu', users: 180, quizzes: 90 },
                { name: 'Fri', users: 250, quizzes: 150 },
                { name: 'Sat', users: 300, quizzes: 210 },
                { name: 'Sun', users: 280, quizzes: 190 },
              ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip cursor={{ fill: 'var(--bg-tertiary)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--glass-shadow)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                <Bar dataKey="users" name="Active Users" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quizzes" name="Quizzes Taken" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* LEFT COLUMN: FORMS */}
        <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* TABS */}
          <div style={{ display: "flex", gap: "10px", background: "var(--card-highlight)", padding: "8px", borderRadius: "12px", border: "1px solid var(--glass-border)", marginBottom: "8px" }}>
            <button 
              type="button"
              onClick={() => setActiveTab("text")}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: activeTab === "text" ? "var(--accent-primary)" : "transparent", color: activeTab === "text" ? "#fff" : "var(--text-secondary)", fontWeight: activeTab === "text" ? "600" : "500", cursor: "pointer", transition: "all 0.2s" }}
            >
              Text Note
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab("file")}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: activeTab === "file" ? "var(--accent-secondary)" : "transparent", color: activeTab === "file" ? "#fff" : "var(--text-secondary)", fontWeight: activeTab === "file" ? "600" : "500", cursor: "pointer", transition: "all 0.2s" }}
            >
              File Upload
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab("placement")}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: activeTab === "placement" ? "var(--warning)" : "transparent", color: activeTab === "placement" ? "#fff" : "var(--text-secondary)", fontWeight: activeTab === "placement" ? "600" : "500", cursor: "pointer", transition: "all 0.2s" }}
            >
              Q&A
            </button>
          </div>

          {activeTab === "text" && (
            <TextNoteForm user={user} setNotesList={setNotesList} availableSubjects={availableSubjects} />
          )}

          {activeTab === "file" && (
            <FileUploadForm user={user} setNotesList={setNotesList} />
          )}
 
          {activeTab === "placement" && (
            <PlacementForm user={user} setNotesList={setNotesList} />
          )}
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <SessionActivity notesList={notesList} />
      </div>
    </div>
  );
}

export default Admin;
