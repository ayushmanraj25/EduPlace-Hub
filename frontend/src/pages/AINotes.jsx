import { useState } from "react";

function AINotes() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNotes = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch("http://localhost:5001/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question, userId: user.email }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setAnswer(data.notes);
      } else {
        setAnswer(`⚠️ Error: ${data.message || "Failed to generate notes"}`);
      }
    } catch (error) {
      setAnswer("⚠️ Error: AI Service is offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 className="gradient-text" style={{ fontSize: "40px", marginBottom: "10px" }}>AI Study Assistant</h1>
        <p style={{ color: "var(--text-secondary)" }}>Ask anything and get instant study notes.</p>
      </div>

      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px" }}>
        <textarea
          placeholder="Enter your topic or question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "100%", height: "120px", background: "var(--card-highlight)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "15px", color: "var(--text-primary)", fontSize: "16px", marginBottom: "20px", outline: "none" }}
          disabled={loading}
        />
        <button
          onClick={generateNotes}
          className="primary-btn"
          style={{ width: "100%", padding: "15px", fontSize: "16px" }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Notes ✨"}
        </button>
      </div>

      {answer && (
        <div className="glass-panel animate-fade-in" style={{ padding: "30px", border: "1px solid var(--accent-primary)" }}>
          <h3 style={{ marginBottom: "20px", color: "var(--accent-primary)" }}>Study Notes</h3>
          <div style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "15px" }}>
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}

export default AINotes;
