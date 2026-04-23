import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Subjects() {
  const navigate = useNavigate();
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
          return (
            <div
              key={index}
              className={`glass-panel animate-slide-up delay-${(index % 5 + 1) * 100}`}
              style={{
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
              }}
              onClick={() => navigate(`/subjects/${subject.replace(/\s+/g, '-')}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
              }}
            >
              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                {subject}
              </h3>
              <button
                className="secondary-btn"
                style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/subjects/${subject.replace(/\s+/g, '-')}`);
                }}
              >
                View Notes
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Subjects;
