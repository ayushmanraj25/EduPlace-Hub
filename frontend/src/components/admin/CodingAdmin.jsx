import React, { useState } from "react";

function CodingAdmin({ user }) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");
  const [testCases, setTestCases] = useState([{ input: "", output: "", isHidden: false }]);
  const [loading, setLoading] = useState(false);

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
          description,
          testCases,
          role: user?.role
        })
      });
      if (res.ok) {
        alert("Coding Challenge Added Successfully! ✅");
        setTitle("");
        setDescription("");
        setTestCases([{ input: "", output: "", isHidden: false }]);
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
