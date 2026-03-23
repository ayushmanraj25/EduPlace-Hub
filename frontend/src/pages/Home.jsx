import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../components/NotificationPopup";

function Home() {
  const [latestNotes, setLatestNotes] = useState([]);
  const navigate = useNavigate();

  // Auto refresh every 5 seconds
  useEffect(() => {
    fetchNotes();
    const interval = setInterval(fetchNotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/notes");
      const data = await res.json();
      // Sort newest first
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setLatestNotes(sorted.slice(0, 3)); // show only latest 3
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginTop: '60px', marginBottom: '80px' }} className="animate-slide-up">
        <h1 className="gradient-text" style={{ fontSize: '64px', fontWeight: '800', letterSpacing: '-2px', marginBottom: '20px' }}>
          Learn. Prepare. Succeed.
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          One platform to master subjects, gear up for placements, and
          accelerate learning with AI-generated study notes.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="primary-btn" onClick={() => navigate('/login')}>Get Started</button>
          <button className="secondary-btn" onClick={() => navigate('/subjects')}>Explore Subjects</button>
        </div>
      </section>

      {/* Live Updates Section */}
      {latestNotes.length > 0 && (
        <section className="glass-panel animate-slide-up delay-100" style={{ padding: '24px', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--danger)', animation: 'pulse-glow 2s infinite' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Live Updates</h2>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {latestNotes.map((note) => (
              <div key={note._id} style={{ 
                background: 'var(--card-highlight)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid var(--card-highlight-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <span style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  color: 'var(--danger)', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '12px', 
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}>NEW</span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>{note.subject}</strong>
                  <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>—</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{note.topic}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px',
        marginBottom: '60px'
      }}>
        {/* Card 1 */}
        <div className="glass-panel animate-slide-up delay-200" style={{ padding: '32px', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>📚</div>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', color: 'var(--text-primary)' }}>Subject Learning</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Access semester-wise subjects with structured topics
            and manually verified notes tailored for your curriculum.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-panel animate-slide-up delay-300" style={{ padding: '32px', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🤖</div>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', color: 'var(--text-primary)' }}>AI Assisted Notes</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Get instant explanations and examples using AI whenever
            you need extra clarity on complex topics.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel animate-slide-up delay-400" style={{ padding: '32px', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>💼</div>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', color: 'var(--text-primary)' }}>Placement Prep</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Practice aptitude, technical, HR questions, and
            company-specific interview material.
          </p>
        </div>
      </section>
      <NotificationPopup />
    </div>
  );
}

export default Home;
