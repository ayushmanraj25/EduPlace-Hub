import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);

  // Resizing state
  const [leftWidth, setLeftWidth] = useState(40);
  const [topHeight, setTopHeight] = useState(65);
  const rightPanelRef = useRef(null);

  useEffect(() => {
    const defaultCodeMap = {
      python: "def solve():\n    # Write your code here\n    pass\n\nsolve()",
      javascript: "function solve() {\n    // Write your code here\n}\n\nsolve();",
      "c++": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}",
      java: "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}"
    };

    const loadDraft = async (lang) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.email) {
        try {
          const res = await fetch(`http://localhost:5001/api/coding/draft/${id}/${user.email}/${lang}`);
          const data = await res.json();
          if (data && data.code) {
            setCode(data.code);
            localStorage.setItem(`saved_code_${id}_${lang}`, data.code);
            return true;
          }
        } catch (e) {
          console.log("Failed to load draft from DB", e);
        }
      }
      return false;
    };

    fetch(`http://localhost:5001/api/coding/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Question not found");
        return res.json();
      })
      .then(async data => {
        setQuestion(data);
        const hasDbDraft = await loadDraft(language);
        if (!hasDbDraft) {
          const savedCode = localStorage.getItem(`saved_code_${id}_${language}`);
          setCode(savedCode ? savedCode : defaultCodeMap[language]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        navigate("/coding");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleLanguageChange = async (e) => {
    const defaultCodeMap = {
      python: "def solve():\n    # Write your code here\n    pass\n\nsolve()",
      javascript: "function solve() {\n    // Write your code here\n}\n\nsolve();",
      "c++": "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}",
      java: "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}"
    };
    const newLang = e.target.value;
    setLanguage(newLang);
    
    let hasDbDraft = false;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.email) {
      try {
        const res = await fetch(`http://localhost:5001/api/coding/draft/${id}/${user.email}/${newLang}`);
        const data = await res.json();
        if (data && data.code) {
          setCode(data.code);
          localStorage.setItem(`saved_code_${id}_${newLang}`, data.code);
          hasDbDraft = true;
        }
      } catch (e) {}
    }

    if (!hasDbDraft) {
      const savedCode = localStorage.getItem(`saved_code_${id}_${newLang}`);
      setCode(savedCode ? savedCode : defaultCodeMap[newLang]);
    }
  };

  const saveTimeoutRef = useRef(null);
  
  const handleCodeChange = (val) => {
    setCode(val);
    localStorage.setItem(`saved_code_${id}_${language}`, val);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.email) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        fetch("http://localhost:5001/api/coding/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.email, questionId: id, language, code: val })
        }).catch(e => console.log("Draft DB save failed"));
      }, 1500); // debounce 1.5 seconds
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const res = await fetch("http://localhost:5001/api/coding/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          questionId: id,
          userId: user?.email
        })
      });
      const data = await res.json();
      setOutput(data);
      if (data && data.success) {
         const solved = JSON.parse(localStorage.getItem('solved_coding') || '[]');
         const idStr = String(id);
         if (!solved.includes(idStr)) {
            localStorage.setItem('solved_coding', JSON.stringify([...solved, idStr]));
         }
      }
    } catch (err) {
      setOutput({ error: true, message: "Network error. Failed to reach execution server." });
    } finally {
      setRunning(false);
    }
  };

  const startHorizontalDrag = (e) => {
    e.preventDefault();
    const onMouseMove = (moveEvent) => {
      const newWidth = (moveEvent.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const startVerticalDrag = (e) => {
    e.preventDefault();
    const container = rightPanelRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    const onMouseMove = (moveEvent) => {
      const newHeight = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      if (newHeight > 20 && newHeight < 80) setTopHeight(newHeight);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading workspace...</div>;
  if (!question) return <div style={{ padding: "40px", textAlign: "center" }}>Question not found.</div>;

  return (
    <div style={{ display: "flex", height: "calc(100vh - 70px)", background: "var(--bg-primary)" }}>
      {/* LEFT PANEL: PROBLEM DESCRIPTION */}
      <div style={{ width: `${leftWidth}%`, borderRight: "1px solid var(--glass-border)", padding: "24px", overflowY: "auto", background: "var(--bg-secondary)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "24px" }}>{question.title}</h2>
          <span style={{ 
            padding: "4px 12px", 
            borderRadius: "50px", 
            fontSize: "12px", 
            fontWeight: "bold",
            background: question.difficulty === "Easy" ? "rgba(16,185,129,0.1)" : question.difficulty === "Medium" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
            color: question.difficulty === "Easy" ? "var(--success)" : question.difficulty === "Medium" ? "var(--warning)" : "var(--danger)",
          }}>
            {question.difficulty}
          </span>
        </div>
        <div style={{ lineHeight: "1.6", color: "var(--text-secondary)", fontSize: "15px" }} dangerouslySetInnerHTML={{ __html: question.description.replace(/\n/g, '<br/>') }} />
        
        <div style={{ marginTop: "32px", borderTop: "1px solid var(--glass-border)", paddingTop: "16px" }}>
           <h4 style={{ color: "var(--text-primary)", marginBottom: "12px" }}>Test Cases Info</h4>
           <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Total Test Cases: {question.testCases?.length || 0}</p>
        </div>
      </div>

      {/* HORIZONTAL RESIZER */}
      <div 
        onMouseDown={startHorizontalDrag}
        style={{ width: "6px", cursor: "col-resize", background: "var(--glass-border)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
         <div style={{ width: "2px", height: "24px", background: "rgba(0,0,0,0.3)", borderRadius: "2px" }} />
      </div>

      {/* RIGHT PANEL: EDITOR & CONSOLE */}
      <div ref={rightPanelRef} style={{ width: `calc(${100 - leftWidth}% - 6px)`, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        
        {/* TOP RIGHT: EDITOR */}
        <div style={{ height: `${topHeight}%`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Editor Toolbar */}
          <div style={{ height: "50px", minHeight: "50px", background: "#1E1E1E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid #333" }}>
            <select 
              value={language} 
              onChange={handleLanguageChange}
              style={{ background: "#333", color: "#fff", border: "1px solid #555", borderRadius: "4px", padding: "4px 8px", outline: "none" }}
            >
              <option value="python">Python 3</option>
              <option value="javascript">JavaScript (Node)</option>
              <option value="c++">C++</option>
              <option value="java">Java</option>
            </select>

            <button 
              onClick={handleRun}
              disabled={running}
              style={{ 
                background: running ? "#555" : "var(--success)", 
                color: "white", 
                border: "none", 
                padding: "6px 16px", 
                borderRadius: "4px", 
                fontWeight: "bold", 
                cursor: running ? "not-allowed" : "pointer",
                transition: "opacity 0.2s"
              }}
            >
              {running ? "Running..." : "▶ Run Code"}
            </button>
          </div>

          {/* Code Editor */}
          <div style={{ flex: 1, position: "relative", minHeight: 0, overflow: "hidden" }}>
            <Editor
              height="100%"
              theme="vs-dark"
              language={language === "c++" ? "cpp" : language}
              value={code}
              onChange={handleCodeChange}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        </div>

        {/* VERTICAL RESIZER */}
        <div 
          onMouseDown={startVerticalDrag}
          style={{ height: "6px", cursor: "row-resize", background: "var(--glass-border)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
           <div style={{ height: "2px", width: "24px", background: "rgba(0,0,0,0.3)", borderRadius: "2px" }} />
        </div>

        {/* BOTTOM RIGHT: CONSOLE */}
        <div style={{ height: `calc(${100 - topHeight}% - 6px)`, background: "#1E1E1E", padding: "16px", overflowY: "auto", overflowX: "hidden", color: "#D4D4D4", fontFamily: "monospace" }}>
          <h3 style={{ color: "#fff", fontSize: "14px", margin: "0 0 12px 0", borderBottom: "1px solid #333", paddingBottom: "8px" }}>Console Output</h3>
          
          {!output && !running && <div style={{ color: "#888" }}>Run your code to see the output here...</div>}
          
          {running && <div style={{ color: "#888" }}>Executing your code securely on the sandbox...</div>}
          
          {output && output.error && <div style={{ color: "var(--danger)" }}>{output.message}</div>}
          
          {output && output.success !== undefined && (
            <div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: output.success ? "var(--success)" : "var(--danger)", marginBottom: "12px" }}>
                {output.success ? "Accepted!" : "Wrong Answer"}
              </div>
              <div style={{ marginBottom: "12px", color: "#888" }}>Passed {output.passed} / {output.total} test cases</div>
              
              {output.results && output.results.map((res, i) => (
                <div key={i} style={{ marginBottom: "16px", background: "#252526", padding: "12px", borderRadius: "6px", borderLeft: res.passed ? "4px solid var(--success)" : "4px solid var(--danger)" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#fff" }}>Test Case {res.testCase} {res.passed ? "✅" : "❌"}</div>
                  {res.isHidden ? (
                    <div style={{ color: "#888", fontStyle: "italic" }}>Hidden Test Case</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "8px", fontSize: "13px" }}>
                      <div style={{ color: "#888" }}>Input:</div>
                      <div style={{ whiteSpace: "pre-wrap" }}>{res.input}</div>
                      <div style={{ color: "#888" }}>Expected:</div>
                      <div style={{ whiteSpace: "pre-wrap" }}>{res.expectedOutput}</div>
                      <div style={{ color: "#888" }}>Output:</div>
                      <div style={{ color: res.passed ? "var(--success)" : "var(--danger)", whiteSpace: "pre-wrap" }}>{res.actualOutput || "<empty>"}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Workspace;
