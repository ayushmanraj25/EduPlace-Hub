import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Placement() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeCategory) {
      fetchQuestions(activeCategory);
    }
  }, [activeCategory]);

  const fetchQuestions = async (category) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/placement?category=${encodeURIComponent(category)}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      title: "Aptitude",
      icon: "🧠",
      desc: "Quantitative, Logical & Verbal practice to sharpen your reasoning skills for online tests.",
      topics: ["Number System", "Percentage", "Profit & Loss", "Time & Work", "Permutation & Combination", "Probability", "Coding-Decoding", "Blood Relations", "Seating Arrangement", "Syllogisms"],
    },
    {
      title: "Technical – DSA",
      icon: "💻",
      desc: "Master Arrays, Trees, Graphs, DP, and Sorting algorithms asked in coding rounds.",
      topics: ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Binary Trees & BST", "Graphs (BFS/DFS)", "Dynamic Programming", "Sorting & Searching", "Recursion & Backtracking", "Hashing", "Greedy Algorithms"],
    },
    {
      title: "Technical – Core CS",
      icon: "⚙️",
      desc: "Operating Systems, DBMS, CN and OOPs – the core pillars of every technical interview.",
      topics: ["Process & Threads", "Deadlock", "Memory Management", "SQL Queries & Joins", "Normalization", "TCP/IP & OSI Model", "OOPs Concepts", "Inheritance & Polymorphism", "Indexing & Transactions", "Socket Programming"],
    },
    {
      title: "HR Interview",
      icon: "🗣️",
      desc: "Master responses to behavioral, situational, and common HR questions.",
      topics: ["Tell Me About Yourself", "Strengths & Weaknesses", "Why This Company?", "Where Do You See Yourself in 5 Years?", "Describe a Challenge You Overcame", "Teamwork vs Leadership", "Salary Expectations", "Why Should We Hire You?", "Conflict Resolution", "Work-Life Balance"],
    },
    {
      title: "Group Discussion",
      icon: "👥",
      desc: "Tips and strategies to ace GD rounds with confidence and structure.",
      topics: ["Current Affairs Topics", "Abstract Topics", "Case-Study Based GD", "How to Initiate a GD", "Body Language Tips", "Summarization Techniques"],
    },
    {
      title: "Coding Platforms",
      icon: "🏆",
      desc: "Practice on competitive platforms – LeetCode, Codeforces, HackerRank patterns.",
      topics: ["LeetCode Top 150", "Codeforces Div 2 Problems", "HackerRank Certifications", "CodeChef Starters", "GeeksforGeeks Practice", "InterviewBit Tracks"],
    },
    {
      title: "Resume & Profile",
      icon: "📄",
      desc: "Build an ATS-friendly resume and optimize your LinkedIn & GitHub profiles.",
      topics: ["ATS Resume Format", "Action Verbs for Resume", "Project Descriptions", "LinkedIn Optimization", "GitHub Portfolio", "Cover Letter Writing"],
    },
    {
      title: "Company Wise",
      icon: "🏢",
      desc: "Tailored preparation with real questions from TCS, Infosys, Wipro, FAANG & more.",
      link: "/company-wise",
    },
  ];

  return (
    <div className="page-container">
      <div className="animate-slide-up">
        <h2 className="gradient-text" style={{ fontSize: '42px', marginBottom: '10px' }}>Placement Preparation</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '50px' }}>
          Structure your career path with curated, high-quality interview resources across every category.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
      }}>
        {categories.map((cat, idx) => {
          const isCompanyWise = !!cat.link;
          const isExpanded = activeCategory === cat.title;
          return (
            <div
              key={idx}
              className={`glass-panel animate-slide-up delay-${(idx % 5 + 1) * 100}`}
              style={{
                padding: "30px",
                transition: "all 0.3s ease",
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border: isExpanded ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                gridColumn: isExpanded ? '1 / -1' : 'span 1'
              }}
              onClick={() => {
                if (isCompanyWise) navigate(cat.link);
                else setActiveCategory(isExpanded ? null : cat.title);
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                    fontSize: "36px",
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--card-highlight)',
                    borderRadius: '14px',
                    flexShrink: 0,
                  }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {cat.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.4' }}>
                    {cat.desc}
                  </p>
                </div>
              </div>

              {isExpanded && !isCompanyWise && (
                <div className="animate-fade-in" style={{ marginTop: '20px' }}>
                  {loading ? (
                    <p>Loading questions...</p>
                  ) : questions.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No questions yet for this category.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {questions.map((q, qIdx) => (
                        <div key={qIdx} className="glass-panel" style={{ padding: '20px', background: 'var(--bg-tertiary)' }}>
                          <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '8px' }}>{q.topic}</strong>
                          <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '10px' }}>Q: {q.question}</p>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic' }}>A: {q.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!isExpanded && (
                <div style={{ marginTop: 'auto' }}>
                  {isCompanyWise ? (
                    <button className="primary-btn" style={{ width: '100%' }}>
                      View All Companies →
                    </button>
                  ) : (
                    <div style={{ marginTop: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Key Topics</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {cat.topics.map((topic, tIdx) => (
                          <span key={tIdx} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: 'var(--card-highlight)', color: 'var(--text-secondary)', border: '1px solid var(--card-highlight-border)' }}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Placement;