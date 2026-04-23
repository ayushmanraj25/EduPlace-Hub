import React, { useState, useEffect, useRef } from "react";

function AIFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const widgetRef = useRef(null);

  // Bookmarks State
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("ai_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const saveBookmark = () => {
    if (!answer || answer.includes("⚠️ Error")) return;
    const newBookmark = {
      id: Date.now().toString(),
      question: question || "Last Query", // fallback if cleared
      text: answer,
      date: new Date().toLocaleDateString()
    };
    const updated = [newBookmark, ...bookmarks];
    setBookmarks(updated);
    localStorage.setItem("ai_bookmarks", JSON.stringify(updated));
  };

  const deleteBookmark = (id) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("ai_bookmarks", JSON.stringify(updated));
  };

  const generateNotes = async () => {
    if (!question.trim()) return;

    const queryToSend = question;
    setQuestion(""); // Clear input box immediately for better UX
    setLoading(true);
    setAnswer("");
    setShowBookmarks(false); // Switch to chat view if searching

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch("http://localhost:5001/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryToSend, userId: user.email }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setAnswer(data.notes);
        // Temporarily put the question back in state purely so we can save it if bookmarked,
        // without showing it in the input (since input is bound to `question`).
        // Actually, to keep it clean, we'll just save "AI Response" as a generic title.
      } else {
        setAnswer(`⚠️ Error: ${data.message || data.error || "Failed to generate notes"}`);
      }
    } catch (error) {
      setAnswer(`⚠️ Error: Could not connect to the AI Service (${error.message}).`);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (textChunk) => {
    return textChunk.split(/(```[\s\S]*?```)/g).map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        const lang = match && match[1] ? match[1] : 'code';
        const code = match ? match[2] : part.slice(3, -3);

        return (
          <div key={index} style={{ margin: "14px 0", borderRadius: "8px", overflow: "hidden", border: "1px solid #333", background: "#1e1e1e", width: "100%", alignSelf:"stretch" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: "#2d2d2d", color: "#ccc", fontSize: "12px", fontFamily: "monospace" }}>
              <span>{lang}</span>
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(code);
                  const btn = e.currentTarget;
                  const originalText = btn.innerHTML;
                  btn.innerHTML = "✅ Copied!";
                  btn.style.color = "#10B981";
                  setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.color = "#ccc";
                  }, 2000);
                }}
                style={{ background: "transparent", border: "none", color: "#ccc", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", transition: "color 0.2s" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copy
              </button>
            </div>
            <pre style={{ margin: 0, padding: "16px", overflowX: "auto", color: "#d4d4d4", fontSize: "13px", fontFamily: "monospace", lineHeight: "1.5" }}>
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        return <div key={index} style={{ whiteSpace: "pre-wrap", display: 'inline' }}>
          {part.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((subPart, i) => {
            if (subPart.startsWith('**') && subPart.endsWith('**')) {
              return <strong key={i} style={{ color: 'var(--accent-primary)' }}>{subPart.slice(2, -2)}</strong>;
            }
            if (subPart.startsWith('*') && subPart.endsWith('*')) {
              return <em key={i}>{subPart.slice(1, -1)}</em>;
            }
            return <span key={i}>{subPart}</span>;
          })}
        </div>;
      }
    });
  };

  return (
    <div ref={widgetRef} style={{
      position: "fixed",
      bottom: "30px",
      right: "30px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end"
    }}>
      {/* Expanded Chat Box */}
      <div className="glass-panel" style={{
        width: "360px",
        height: "480px",
        marginBottom: "15px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        background: "var(--bg-primary)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        border: "1px solid var(--glass-border)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
        pointerEvents: isOpen ? "auto" : "none"
      }}>
          {/* Header */}
          <div style={{
            padding: "16px",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              PrepBot 🤖
            </h3>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowBookmarks(!showBookmarks)}
                style={{ 
                  background: showBookmarks ? "rgba(255,255,255,0.2)" : "transparent",
                  border: "none", color: "white", cursor: "pointer", fontSize: "13px",
                  padding: "4px 8px", borderRadius: "4px", fontWeight: showBookmarks ? "bold" : "normal"
                }}>
                🔖 Bookmarks ({bookmarks.length})
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: "var(--bg-secondary)" }}>
            
            {showBookmarks ? (
              // Bookmarks View
              <>
                {bookmarks.length === 0 ? (
                   <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                     No saved bookmarks yet.<br/> Ask a question and hit 'Save'!
                   </div>
                ) : (
                  bookmarks.map(b => (
                    <div key={b.id} style={{ background: "var(--bg-primary)", border: "1px solid var(--glass-border)", padding: "12px", borderRadius: "8px", fontSize: "13px" }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{b.date}</span>
                        <button onClick={() => deleteBookmark(b.id)} style={{ background:'transparent', border:'none', color:'var(--error)', cursor:'pointer' }}>🗑️</button>
                      </div>
                      <div style={{ color: "var(--text-primary)", lineHeight: "1.6" }}>
                        {renderFormattedText(b.text)}
                      </div>
                    </div>
                  ))
                )}
              </>
            ) : (
              // Chat View
              <>
                <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "8px 8px 8px 0", fontSize: "13px", color: "var(--text-secondary)", alignSelf: "flex-start", maxWidth: "85%" }}>
                  Hi! I'm your AI Study Assistant. Ask me to generate notes, explain concepts, or summarize topics! ✨
                </div>
                
                {answer && (
                  <div style={{ background: "var(--bg-primary)", border: "1px solid var(--accent-primary)", padding: "16px", borderRadius: "8px 8px 8px 0", fontSize: "14px", color: "var(--text-primary)", alignSelf: "flex-start", maxWidth: "90%", lineHeight: "1.6", position: 'relative' }}>
                    {renderFormattedText(answer)}
                    
                    <button 
                      onClick={(e) => {
                        saveBookmark();
                        e.currentTarget.innerHTML = "✅ Saved";
                      }}
                      style={{
                        position: 'absolute', top: '-10px', right: '-10px',
                        background: 'var(--accent-primary)', color: 'white',
                        border: 'none', borderRadius: '20px', padding: '4px 10px',
                        fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                      🔖 Save
                    </button>
                  </div>
                )}
                
                {loading && (
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", alignSelf: "flex-start", fontStyle: "italic" }}>
                    Analyzing bits and bytes... ⏳
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Area (Only show in Chat view) */}
          {!showBookmarks && (
            <div style={{ padding: "16px", borderTop: "1px solid var(--glass-border)", background: "var(--bg-primary)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <textarea
                placeholder="Ask a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{
                  width: "100%",
                  height: "60px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--glass-border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  resize: "none",
                  fontSize: "13px",
                  outline: "none"
                }}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateNotes();
                  }
                }}
              />
              <button
                className="primary-btn"
                onClick={generateNotes}
                disabled={loading || !question.trim()}
                style={{ padding: "8px", fontSize: "13px", borderRadius: "8px", width: "100%" }}
              >
                {loading ? "Thinking..." : "Send Query"}
              </button>
            </div>
          )}
        </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          color: "white",
          border: "none",
          boxShadow: "0 4px 12px rgba(255, 51, 102, 0.4)",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? "✕" : "🤖"}
      </button>
    </div>
  );
}

export default AIFloatingWidget;
