import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizModal from "../components/QuizModal";

function SubjectView() {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const [completedNotes, setCompletedNotes] = useState(() => {
    const saved = localStorage.getItem("completed_notes");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleComplete = (noteId) => {
    let newCompleted;
    if (completedNotes.includes(noteId)) {
      newCompleted = completedNotes.filter(id => id !== noteId);
    } else {
      newCompleted = [...completedNotes, noteId];
    }
    setCompletedNotes(newCompleted);
    localStorage.setItem("completed_notes", JSON.stringify(newCompleted));
  };

  // Replace dashes from URL with spaces for reading
  const readableSubject = subjectName ? subjectName.replace(/-/g, ' ') : '';

  useEffect(() => {
    // Only scroll to top when page mounts
    window.scrollTo(0, 0);
    
    fetch("http://localhost:5001/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  }, [subjectName]);

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

  const filteredNotes = readableSubject
    ? notes.filter((note) => {
        const sub1 = normalizeSubject(note.subject);
        const sub2 = normalizeSubject(readableSubject);
        return sub1 === sub2 || (note.subject?.toLowerCase().includes(readableSubject.toLowerCase()) || readableSubject.toLowerCase().includes(note.subject?.toLowerCase()));
      })
    : [];

  const progressPercentage = filteredNotes.length > 0 
    ? Math.round((filteredNotes.filter(n => completedNotes.includes(n._id)).length / filteredNotes.length) * 100) 
    : 0;

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      <div className="animate-slide-up" style={{ marginBottom: "40px" }}>
        
        {/* Top Header & Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/subjects')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Subjects
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>📘</span>
            <h2 className="gradient-text" style={{ fontSize: '36px', color: 'var(--text-primary)', margin: 0 }}>
              {readableSubject}
            </h2>
          </div>
          
          <button 
            onClick={() => setIsQuizOpen(true)}
            className="primary-btn" 
            style={{ padding: '10px 20px', fontSize: '15px', display: 'flex', gap: '8px', alignItems: 'center', borderRadius: '50px' }}
          >
            ⭐ Take AI Mock Quiz
          </button>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '800px', marginBottom: '30px' }}>
          Comprehensive notes and modules securely vetted for {readableSubject}.
        </p>

        {/* Progress Bar Module */}
        {filteredNotes.length > 0 && (
          <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>Your Progress</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: progressPercentage === 100 ? 'var(--success)' : 'var(--accent-primary)' }}>
                {progressPercentage}% Completed
              </span>
            </div>
            {/* The Bar Background */}
            <div style={{ width: '100%', height: '10px', background: 'var(--bg-primary)', borderRadius: '50px', overflow: 'hidden' }}>
              {/* The Fill */}
              <div style={{ 
                height: '100%', 
                width: `${progressPercentage}%`, 
                background: progressPercentage === 100 ? 'var(--success)' : 'var(--accent-primary)',
                borderRadius: '50px',
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s'
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {filteredNotes.length === 0 ? (
          <div className="glass-panel animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '8px' }}>No notes available yet.</h3>
            <p style={{ margin: 0 }}>Check back soon or request the admin to verify new materials.</p>
          </div>
        ) : (
          filteredNotes.map((note, index) => {
            const isCompleted = completedNotes.includes(note._id);
            return (
            <div key={note._id} className="glass-panel animate-slide-up" style={{ 
              padding: "32px", 
              animationDelay: `${(index % 5) * 50}ms`,
              borderLeft: isCompleted ? '4px solid var(--success)' : '4px solid var(--accent-primary)',
              background: 'var(--bg-secondary)',
              transition: 'all 0.3s ease',
              opacity: isCompleted ? 0.8 : 1
            }}>
              <strong style={{ display: 'block', fontSize: '22px', marginBottom: '16px', color: 'var(--text-primary)', textDecoration: isCompleted ? 'line-through' : 'none', textDecorationColor: 'var(--text-muted)' }}>
                {note.topic}
              </strong>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap', margin: 0, fontSize: '16px', marginBottom: '24px' }}>
                {note.content}
              </p>
              
              <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => toggleComplete(note._id)}
                  style={{
                    background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    border: isCompleted ? '1px solid var(--success)' : '1px solid var(--glass-border)',
                    color: isCompleted ? 'var(--success)' : 'var(--text-secondary)',
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if(!isCompleted){
                       e.currentTarget.style.background = 'var(--bg-primary)';
                       e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if(!isCompleted){
                       e.currentTarget.style.background = 'transparent';
                       e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '4px', 
                    border: isCompleted ? 'none' : '2px solid var(--text-muted)',
                    background: isCompleted ? 'var(--success)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  {isCompleted ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          )})
        )}
      </div>

      <QuizModal 
        subject={readableSubject} 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
      />
    </div>
  );
}

export default SubjectView;
