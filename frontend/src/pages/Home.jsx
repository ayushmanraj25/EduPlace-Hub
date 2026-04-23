import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [latestNotes, setLatestNotes] = useState([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const navigate = useNavigate();

  // Cycle through the updates every 4 seconds
  useEffect(() => {
    if (latestNotes.length > 0) {
      const timer = setInterval(() => {
        setCurrentPopupIndex((prev) => (prev + 1) % latestNotes.length);
      }, 1600); // 1.6 seconds per popup
      return () => clearInterval(timer);
    }
  }, [latestNotes]);

  // Auto refresh every 5 seconds
  useEffect(() => {
    fetchNotes();
    const interval = setInterval(fetchNotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotes = async () => {
    try {
      const [notesRes, placementRes, companyRes] = await Promise.all([
        fetch("http://localhost:5001/api/notes"),
        fetch("http://localhost:5001/api/placement"),
        fetch("http://localhost:5001/api/company-wise")
      ]);

      const [notesData, placementsData, companyData] = await Promise.all([
        notesRes.ok ? notesRes.json() : [],
        placementRes.ok ? placementRes.json() : [],
        companyRes.ok ? companyRes.json() : []
      ]);

      const notes = Array.isArray(notesData) ? notesData.map(n => ({
        _id: n._id || n.id,
        subject: n.subject,
        topic: n.topic,
        content: n.content,
        createdAt: n.createdAt || n.created_at || "2000-01-01T00:00:00.000Z"
      })) : [];

      const placements = Array.isArray(placementsData) ? placementsData.map(p => ({
        _id: p._id || p.id,
        subject: p.category || "Placement Prep",
        topic: p.topic || p.company || "General",
        content: p.question,
        createdAt: p.createdAt || p.created_at || "2000-01-01T00:00:00.000Z"
      })) : [];

      const company = Array.isArray(companyData) ? companyData.map(c => ({
        _id: c._id || c.id,
        subject: `Company: ${c.company}`,
        topic: c.type || "Interview",
        content: c.question,
        createdAt: c.createdAt || c.created_at || "2000-01-01T00:00:00.000Z"
      })) : [];

      const combined = [...notes, ...placements, ...company];

      const sorted = combined.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setLatestNotes(sorted.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard updates:", error);
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const isRecent = (dateString) => {
    const diff = new Date() - new Date(dateString);
    return diff < 24 * 60 * 60 * 1000; // less than 24 hours
  };

  return (
    <div className="page-container">
      
      {/* 🚀 1. Split-Screen Hero Section */}
      <section className="animate-slide-up" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '40px', 
        marginTop: '20px', 
        marginBottom: '60px',
        flexWrap: 'wrap'
      }}>
        {/* Left Column: Text & CTA */}
        <div style={{ flex: '1 1 500px', maxWidth: '600px' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '6px 14px', 
            borderRadius: '50px', 
            background: 'var(--card-highlight)', 
            border: '1px solid var(--card-highlight-border)',
            color: 'var(--accent-primary)',
            fontWeight: '700',
            fontSize: '13px',
            marginBottom: '24px'
          }}>
            ✨ Your Ultimate AI Study Companion
          </div>
          
          <h1 className="gradient-text" style={{ fontSize: 'clamp(44px, 5vw, 64px)', fontWeight: '800', letterSpacing: '-2px', marginBottom: '24px', lineHeight: '1.1' }}>
            Learn. Prepare. Succeed.
          </h1>
          
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
            One single platform to master complex university subjects, gear up for tough placements, and accelerate your learning with dynamic AI-generated study material.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="primary-btn" onClick={() => navigate('/login')} style={{ fontSize: '16px', padding: '14px 32px' }}>
              Start Learning for Free
            </button>
            <button className="secondary-btn" onClick={() => navigate('/subjects')} style={{ fontSize: '16px', padding: '14px 32px' }}>
              Explore Subjects
            </button>
          </div>
        </div>

        {/* Right Column: Floating Mockup */}
        <div className="floating-mockup" style={{ 
          flex: '1 1 400px', 
          display: 'flex', 
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Subtle background glow */}
          <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: '0.15', borderRadius: '50%', zIndex: 0 }} />
          
          {/* Mockup UI Window */}
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-primary)', zIndex: 1, padding: '0', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}>
            {/* Window Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '8px', background: 'var(--bg-secondary)', borderRadius: '20px 20px 0 0' }}>
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
               <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            {/* Window Body (Mock Chat) */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '12px 12px 12px 0', alignSelf: 'flex-start', maxWidth: '80%', fontSize: '14px', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
                 Generate a quick concept on "Linked Lists" 📚
               </div>
               <div style={{ background: 'var(--card-highlight)', padding: '16px', borderRadius: '12px 12px 0 12px', alignSelf: 'flex-end', width: '90%', fontSize: '13px', color: 'var(--text-primary)', border: `1px solid var(--card-highlight-border)` }}>
                 <strong style={{ color: 'var(--accent-primary)' }}>🤖 AI Response:</strong><br/><br/>
                 A Linked List is a linear data structure where elements are not stored at contiguous memory locations.<br/><br/>
                 <div style={{ background: '#1E1E1E', padding: '10px', borderRadius: '6px', color: '#D4D4D4', fontFamily: 'monospace', marginTop: '8px' }}>
                   struct Node {"{"}<br/>
                   &nbsp;&nbsp;int data;<br/>
                   &nbsp;&nbsp;Node* next;<br/>
                   {"};"}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 2. Trust Header / Stats Banner */}
      <section className="glass-panel animate-slide-up delay-100" style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center',
        padding: '24px 20px', marginBottom: '50px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)'
      }}>
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <h2 style={{ fontSize: '36px', color: 'var(--accent-primary)', marginBottom: '4px' }}>50+</h2>
          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-secondary)' }}>Core Subjects</p>
        </div>
        <div style={{ width: '1px', height: '50px', background: 'var(--glass-border)' }} />
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <h2 style={{ fontSize: '36px', color: 'var(--accent-primary)', marginBottom: '4px' }}>10K+</h2>
          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-secondary)' }}>AI Queries Solved</p>
        </div>
        <div style={{ width: '1px', height: '50px', background: 'var(--glass-border)' }} />
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <h2 style={{ fontSize: '36px', color: 'var(--accent-primary)', marginBottom: '4px' }}>Free</h2>
          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-secondary)' }}>For All Students</p>
        </div>
      </section>

      {/* Single Cycling Popup for Live Activity */}
      <div style={{ position: 'fixed', bottom: '100px', right: '20px', zIndex: 9999, pointerEvents: 'none' }}>
        {latestNotes.length > 0 && (() => {
          const note = latestNotes[currentPopupIndex];
          let actionText = "published new study material";
          let iconColor = "var(--accent-primary)";
          const subjectLower = note.subject?.toLowerCase() || "";
          
          if (subjectLower.includes("company")) {
            iconColor = "var(--warning)";
            actionText = "added a company prep question";
          } else if (subjectLower.includes("placement")) {
            iconColor = "#3B82F6";
            actionText = "posted an interview question";
          } else if (subjectLower.includes("ai") || note.topic?.toLowerCase().includes("ai")) {
            iconColor = "#8B5CF6";
            actionText = "generated AI-assisted insights";
          }

          return (
            <div key={note._id + currentPopupIndex} className="animate-slide-in-right" style={{ 
              width: '320px', padding: '16px', background: 'var(--bg-secondary)', 
              borderRadius: '12px', border: '1px solid var(--glass-border)', 
              borderLeft: `4px solid ${iconColor}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)', pointerEvents: 'auto',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: iconColor }}>LIVE UPDATE</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{timeAgo(note.createdAt)}</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                <strong style={{ fontWeight: '700' }}>Admin</strong> {actionText} in <span style={{ fontWeight: '600' }}>{note.subject}</span>
              </p>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '6px 10px', borderRadius: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {note.topic}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ✨ 3. Enhanced Features Grid */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up delay-300">
         <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '12px' }}>Why Choose EduPlace?</h2>
         <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Everything you need to succeed, all in one place.</p>
      </div>
      
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px',
        marginBottom: '100px'
      }}>
        {/* Card 1 */}
        <div className="glass-panel animate-slide-up delay-300" style={{ padding: '40px 32px', transition: 'all 0.3s ease', background: 'var(--bg-secondary)' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(43,109,76,0.1)'; e.currentTarget.style.borderColor = 'var(--accent-secondary)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--card-highlight)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', color: 'var(--text-primary)' }}>Subject Learning</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Access semester-wise subjects with structured topics
            and manually verified notes tailored for your curriculum. Track your progress live!
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-panel animate-slide-up delay-400" style={{ padding: '40px 32px', transition: 'all 0.3s ease', background: 'var(--bg-secondary)' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(43,109,76,0.1)'; e.currentTarget.style.borderColor = 'var(--accent-secondary)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
          </div>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', color: 'var(--text-primary)' }}>AI Assistant & Quizzes</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Chat with PrepBot for instant explanations, save valuable answers to Bookmarks, and take dynamic Endless AI Mock Quizzes.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel animate-slide-up delay-500" style={{ padding: '40px 32px', transition: 'all 0.3s ease', background: 'var(--bg-secondary)' }}
             onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(43,109,76,0.1)'; e.currentTarget.style.borderColor = 'var(--accent-secondary)'; }}
             onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--glass-shadow)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <h3 style={{ fontSize: '22px', marginBottom: '12px', color: 'var(--text-primary)' }}>Placement Prep</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Practice aptitude, technical, and HR questions directly pulled from top company interview experiences.
          </p>
        </div>
      </section>

      {/* 📢 4. Bottom Final CTA */}
      <section className="animate-slide-up delay-500" style={{
         padding: '60px 40px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
         borderRadius: '24px', textAlign: 'center', color: 'white', marginBottom: '40px',
         boxShadow: '0 20px 40px rgba(43, 109, 76, 0.3)'
      }}>
         <h2 style={{ fontSize: '36px', color: 'white', marginBottom: '16px' }}>Ready to Crack Your Placements?</h2>
         <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px auto', opacity: '0.9' }}>
           Join hundreds of students learning smarter with AI. Create your free account in seconds.
         </p>
         <button 
           onClick={() => navigate('/login')}
           style={{
             background: 'white', color: 'var(--accent-primary)', border: 'none',
             padding: '16px 40px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px',
             cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
           }}
           onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
         >
           Get Started Now ➔
         </button>
      </section>

    </div>
  );
}

export default Home;
