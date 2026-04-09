import { useEffect, useState } from "react";

function Subjects() {
  const [subjects] = useState([
    "Data Structures",
    "DBMS",
    "Operating System",
    "Computer Networks",
    "AI & ML",
    "Object Oriented Programming",
    "Software Engineering",
    "Web Development",
    "Compiler Design",
    "Theory of Computation",
    "Cloud Computing",
    "Cyber Security",
    "Discrete Mathematics",
    "Digital Electronics",
    "Computer Architecture",
  ]);

  const [notes, setNotes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  }, []);

  const normalizeSubject = (sub) => {
    if (!sub) return "";
    let s = sub.toLowerCase().trim().replace(/s$/, ""); // Remove plural 's'
    if (s === "dsa") return "data structure";
    if (s === "dbms" || s === "database") return "dbm";
    if (s === "ai & ml" || s === "ml" || s === "ai") return "ai & ml";
    if (s === "os") return "operating system";
    if (s === "cn") return "computer network";
    if (s === "oops" || s === "oop") return "object oriented programming";
    return s;
  };

  const filteredNotes = selectedSubject
    ? notes.filter((note) => {
        const sub1 = normalizeSubject(note.subject);
        const sub2 = normalizeSubject(selectedSubject);
        return sub1 === sub2 || (note.subject?.toLowerCase().includes(selectedSubject.toLowerCase()) || selectedSubject.toLowerCase().includes(note.subject?.toLowerCase()));
      })
    : [];

  return (
    <div className="page-container">
      <div className="animate-slide-up">
        <h2 className="gradient-text" style={{ fontSize: '42px', marginBottom: '10px' }}>Subjects</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '40px' }}>
          Select a subject to view topics and expertly curated notes.
        </p>
      </div>

      {/* SUBJECT CARDS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '20px',
        marginBottom: '50px'
      }}>
        {subjects.map((subject, index) => {
          const isSelected = selectedSubject === subject;
          return (
            <div
              key={index}
              className={`glass-panel animate-slide-up delay-${(index % 5 + 1) * 100}`}
              style={{
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'var(--glass-shadow)',
                transform: isSelected ? 'translateY(-5px)' : 'none',
              }}
              onClick={() => setSelectedSubject(subject)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                }
              }}
            >
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                {subject}
              </h3>
              <button
                className={isSelected ? "primary-btn" : "secondary-btn"}
                style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSubject(subject);
                }}
              >
                {isSelected ? "Viewing" : "View Notes"}
              </button>
            </div>
          );
        })}
      </div>

      {/* NOTES SECTION */}
      {selectedSubject && (
        <div className="animate-fade-in" style={{ marginTop: "40px" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '32px' }}>📘</span>
            <h3 style={{ fontSize: '28px', color: 'var(--text-primary)' }}>Notes for {selectedSubject}</h3>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredNotes.length === 0 ? (
              <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <em>No notes available for this subject yet.</em>
              </div>
            ) : (
              filteredNotes.map((note, index) => (
                <div key={note._id} className="glass-panel animate-slide-up" style={{ 
                  padding: "24px", 
                  animationDelay: `${index * 50}ms`,
                  borderLeft: '4px solid var(--accent-primary)'
                }}>
                  <strong style={{ display: 'block', fontSize: '20px', marginBottom: '12px', color: 'var(--text-primary)' }}>
                    {note.topic}
                  </strong>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;
