import React, { useState } from "react";

function CodingAdmin({ user }) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", output: "", isHidden: false }]);
  const [loading, setLoading] = useState(false);

  // LeetCode Fetch State
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState("");

  const handleFetchLeetCode = async () => {
    if (!leetcodeUrl.trim()) return;
    setFetching(true);
    setFetchMsg("");
    try {
      const res = await fetch("http://localhost:5001/api/coding/fetch-leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: leetcodeUrl.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setFetchMsg("❌ " + data.message);
        return;
      }

      // Auto-fill the form
      setTitle(data.title || "");
      setDifficulty(data.difficulty || "Easy");
      setDescription(data.description || "");
      setTopics((data.topics || []).join(", "));

      if (data.testCases && data.testCases.length > 0) {
        setTestCases(data.testCases);
      }

      setFetchMsg(`✅ Fetched "${data.title}" successfully! Topics: ${(data.topics || []).join(", ")}`);
    } catch (err) {
      setFetchMsg("❌ Network error: " + err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", output: "", isHidden: false }]);
  };

  const handleRemoveTestCase = (index) => {
    const newTc = [...testCases];
    newTc.splice(index, 1);
    setTestCases(newTc);
  };

  const handleChangeTestCase = (index, field, value) => {
    const newTc = [...testCases];
    newTc[index][field] = value;
    setTestCases(newTc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/coding/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          difficulty,
          description: topics ? `<div style="margin-bottom:8px"><b>Topics:</b> ${topics}</div>${description}` : description,
          testCases,
          role: user?.role
        })
      });
      if (res.ok) {
        alert("Coding Challenge Added Successfully! ✅");
        setTitle("");
        setDescription("");
        setTopics("");
        setTestCases([{ input: "", output: "", isHidden: false }]);
        setLeetcodeUrl("");
        setFetchMsg("");
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (error) {
      alert("Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") return null;

  return (
    <div style={{ background: "var(--bg-secondary)", borderRadius: "16px", padding: "24px", boxShadow: "var(--glass-shadow)" }}>
      <h3 style={{ margin: "0 0 20px 0", color: "var(--text-primary)" }}>➕ Add Coding Challenge</h3>

      {/* ===== LEETCODE AUTO-FETCH SECTION ===== */}
      <div style={{ 
        background: "linear-gradient(135deg, rgba(255,161,22,0.08), rgba(255,161,22,0.02))", 
        border: "1px solid rgba(255,161,22,0.2)", 
        borderRadius: "12px", 
        padding: "16px", 
        marginBottom: "20px" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "20px" }}>⚡</span>
          <h4 style={{ margin: 0, color: "var(--text-primary)", fontSize: "15px" }}>Auto-Fetch from LeetCode</h4>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input 
            type="url" 
            placeholder="Paste LeetCode URL (e.g. https://leetcode.com/problems/two-sum/)" 
            className="input-control" 
            value={leetcodeUrl} 
            onChange={(e) => setLeetcodeUrl(e.target.value)} 
            style={{ flex: 1 }}
          />
          <button 
            type="button" 
            onClick={handleFetchLeetCode} 
            disabled={fetching || !leetcodeUrl.trim()} 
            style={{ 
              background: fetching ? "#555" : "linear-gradient(135deg, #FFA116, #FF8C00)", 
              color: "#fff", 
              border: "none", 
              padding: "10px 20px", 
              borderRadius: "8px", 
              cursor: fetching ? "not-allowed" : "pointer", 
              fontWeight: "bold",
              fontSize: "13px",
              whiteSpace: "nowrap",
              transition: "opacity 0.2s"
            }}
          >
            {fetching ? "⏳ Fetching..." : "🔍 Fetch"}
          </button>
        </div>
        {fetchMsg && (
          <div style={{ 
            marginTop: "10px", 
            padding: "8px 12px", 
            borderRadius: "8px", 
            fontSize: "13px",
            background: fetchMsg.includes("✅") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            color: fetchMsg.includes("✅") ? "var(--success)" : "var(--danger)",
            border: `1px solid ${fetchMsg.includes("✅") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`
          }}>
            {fetchMsg}
          </div>
        )}
        <p style={{ margin: "8px 0 0 0", fontSize: "11px", color: "var(--text-muted)" }}>
          Title, Difficulty, Topics, Description & Sample Test Cases will be auto-filled. Hidden test cases need to be added manually.
        </p>
      </div>

      {/* ===== OR DIVIDER ===== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 0 20px 0' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>OR ADD MANUALLY</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }} />
      </div>

      {/* ===== MANUAL FORM ===== */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <div style={{ display: "flex", gap: "16px" }}>
          <input 
            type="text" 
            placeholder="Challenge Title (e.g. Two Sum)" 
            className="input-control" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ flex: 2 }}
          />
          <select 
            className="input-control" 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟠 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>
        </div>

        {/* Topics Field */}
        <input 
          type="text" 
          placeholder="Topics (e.g. Array, Hash Table, Dynamic Programming)" 
          className="input-control" 
          value={topics} 
          onChange={(e) => setTopics(e.target.value)} 
        />

        <textarea 
          placeholder="Problem Description (You can use simple HTML or Text)" 
          className="input-control" 
          rows="5" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />

        <div style={{ border: "1px solid var(--glass-border)", padding: "16px", borderRadius: "12px", background: "var(--bg-primary)" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "var(--text-primary)" }}>Test Cases</h4>
          {testCases.map((tc, idx) => (
            <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
              <input 
                type="text" 
                placeholder={`Input ${idx+1}`} 
                className="input-control" 
                value={tc.input} 
                onChange={(e) => handleChangeTestCase(idx, 'input', e.target.value)} 
              />
              <input 
                type="text" 
                placeholder={`Expected Output ${idx+1}`} 
                className="input-control" 
                value={tc.output} 
                onChange={(e) => handleChangeTestCase(idx, 'output', e.target.value)} 
                required 
              />
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                <input 
                  type="checkbox" 
                  checked={tc.isHidden} 
                  onChange={(e) => handleChangeTestCase(idx, 'isHidden', e.target.checked)} 
                /> Hidden
              </label>
              {testCases.length > 1 && (
                <button type="button" onClick={() => handleRemoveTestCase(idx)} style={{ background: "transparent", color: "var(--danger)", border: "none", cursor: "pointer", fontSize: "16px" }}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddTestCase} style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px dashed var(--text-muted)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", marginTop: "8px", width: "100%" }}>
            + Add Another Test Case
          </button>
        </div>

        <button type="submit" className="primary-btn" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Saving..." : "Publish Challenge"}
        </button>
      </form>
    </div>
  );
}

export default CodingAdmin;
