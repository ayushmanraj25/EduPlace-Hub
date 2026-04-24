import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CodingList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solvedQuestions, setSolvedQuestions] = useState([]);

  useEffect(() => {
    setSolvedQuestions(JSON.parse(localStorage.getItem('solved_coding') || '[]'));
    fetch("http://localhost:5001/api/coding")
      .then(res => res.json())
      .then(data => {
        setQuestions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching coding questions", err);
        setLoading(false);
      });
  }, []);

  const getDifficultyColor = (diff) => {
    switch(diff?.toLowerCase()) {
      case "easy": return "var(--success)";
      case "medium": return "var(--warning)";
      case "hard": return "var(--danger)";
      default: return "var(--text-secondary)";
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: "40px" }}>
        <h2 className="gradient-text" style={{ fontSize: "38px", marginBottom: "10px" }}>Coding Arena</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
          Sharpen your programming skills by solving real-world coding challenges.
        </p>
      </div>

      <div style={{ background: "var(--bg-secondary)", borderRadius: "16px", padding: "24px", boxShadow: "var(--glass-shadow)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>Loading challenges...</div>
        ) : questions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>No coding challenges available right now. Check back later!</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--glass-border)", textAlign: "left", color: "var(--text-muted)" }}>
                <th style={{ padding: "16px 8px", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "16px 8px", fontWeight: "600" }}>Title</th>
                <th style={{ padding: "16px 8px", fontWeight: "600" }}>Difficulty</th>
                <th style={{ padding: "16px 8px", fontWeight: "600", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={q.id} style={{ borderBottom: "1px solid var(--glass-border)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="var(--bg-primary)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding: "16px 8px", width: "60px", textAlign: "center" }}>
                    {solvedQuestions.includes(String(q.id)) ? (
                      <span style={{ color: "var(--success)", fontSize: "18px" }}>✅</span>
                    ) : (
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", margin: "0 auto" }}></div>
                    )}
                  </td>
                  <td style={{ padding: "16px 8px", fontWeight: "600", color: "var(--text-primary)" }}>
                    <Link to={`/coding/${q.id}`} style={{ color: "inherit", textDecoration: "none" }}>{idx + 1}. {q.title}</Link>
                  </td>
                  <td style={{ padding: "16px 8px", color: getDifficultyColor(q.difficulty), fontWeight: "600" }}>
                    {q.difficulty}
                  </td>
                  <td style={{ padding: "16px 8px", textAlign: "right" }}>
                    <Link to={`/coding/${q.id}`} className="secondary-btn" style={{ display: "inline-block", padding: "8px 16px", fontSize: "14px", cursor: "pointer", position: "relative", zIndex: 10 }}>Solve</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CodingList;
