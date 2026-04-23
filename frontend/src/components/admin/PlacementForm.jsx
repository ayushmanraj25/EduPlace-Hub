import React, { useState } from "react";

function PlacementForm({ user, setNotesList }) {
  const [placementCategory, setPlacementCategory] = useState("Aptitude");
  const [placementTopic, setPlacementTopic] = useState("");
  const [placementCompany, setPlacementCompany] = useState("");
  const [placementQuestion, setPlacementQuestion] = useState("");
  const [placementAnswer, setPlacementAnswer] = useState("");
  const [placementYear, setPlacementYear] = useState(new Date().getFullYear());
  const [placementType, setPlacementType] = useState("Technical");
  const [placementLoading, setPlacementLoading] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const handleAddPlacement = async (e) => {
    e.preventDefault();
    const isCompanyWise = placementCategory === "Company Wise";

    // Custom validation based on category
    const isTopicFilled = isCompanyWise || placementTopic.trim();
    const isCompanyFilled = !isCompanyWise || placementCompany.trim();

    if (!isTopicFilled || !isCompanyFilled || !placementQuestion.trim() || !placementAnswer.trim()) {
      alert("Please fill all placement fields");
      return;
    }
    setPlacementLoading(true);
    try {
      const endpoint = isCompanyWise
        ? "http://localhost:5001/api/company-wise"
        : "http://localhost:5001/api/placement/add";

      const basePayload = isCompanyWise
        ? {
            company: placementCompany.trim(),
            type: placementType,
            year: parseInt(placementYear),
            userId: user.email,
          }
        : {
            category: placementCategory,
            topic: placementTopic.trim(),
            company: placementCompany.trim(),
            userId: user.email,
          };

      if (isBulkMode) {
        const aiResponse = await fetch("http://localhost:5001/api/ai/format-bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionsText: placementQuestion,
            hintsText: placementAnswer
          })
        });

        if (!aiResponse.ok) {
           const errData = await aiResponse.json();
           throw new Error(errData.message || "Failed to format bulk data via AI");
        }
        
        const aiData = await aiResponse.json();
        const parsedItems = aiData.data;

        if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
          throw new Error("No questions could be parsed.");
        }

        const successItems = [];
        for (const item of parsedItems) {
          const payload = { ...basePayload, question: item.question, answer: item.hint };
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            successItems.push({
              type: "placement",
              subject: placementCategory,
              topic: isCompanyWise ? placementCompany.trim() : placementTopic.trim(),
              note: item.question.substring(0, 100) + "...",
            });
          }
        }

        setNotesList((prev) => [...prev, ...successItems]);
        alert(`Successfully uploaded ${successItems.length} questions! ✅`);
      } else {
        const payload = { 
          ...basePayload, 
          question: placementQuestion.trim(), 
          answer: placementAnswer.trim() 
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || "Failed to save question");
        
        setNotesList((prev) => [
          ...prev,
          {
            type: "placement",
            subject: placementCategory,
            topic: isCompanyWise ? placementCompany.trim() : placementTopic.trim(),
            note: placementQuestion.trim().substring(0, 100) + "...",
          },
        ]);
        alert("Placement question saved ✅");
      }

      setPlacementTopic("");
      setPlacementCompany("");
      setPlacementQuestion("");
      setPlacementAnswer("");
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message || "Failed to save placement questions"} ❌`);
    } finally {
      setPlacementLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAddPlacement}
      className="glass-panel animate-slide-up delay-300"
      style={{ padding: "30px" }}
    >
      <h3 style={{ fontSize: "20px", marginBottom: "24px", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: "var(--warning)" }}>💼</span> Add Placement Question{isBulkMode ? "s" : ""}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            id="bulkMode" 
            checked={isBulkMode} 
            onChange={(e) => setIsBulkMode(e.target.checked)} 
            style={{ width: "16px", height: "16px", cursor: "pointer" }} 
          />
          <label htmlFor="bulkMode" style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600", cursor: "pointer" }}>
            Enable Bulk Upload via AI
          </label>
        </div>
      </h3>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Category</label>
        <select
          value={placementCategory}
          onChange={(e) => setPlacementCategory(e.target.value)}
          className="input-control"
        >
          <option>Aptitude</option>
          <option>Technical – DSA</option>
          <option>Technical – Core CS</option>
          <option>HR Interview</option>
          <option>Company Wise</option>
        </select>
      </div>

      {placementCategory === "Company Wise" ? (
        <>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Company Name</label>
            <input
              type="text"
              placeholder="e.g. Google, Amazon, TCS"
              value={placementCompany}
              onChange={(e) => setPlacementCompany(e.target.value)}
              className="input-control"
              required
            />
          </div>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Type</label>
              <select
                value={placementType}
                onChange={(e) => setPlacementType(e.target.value)}
                className="input-control"
              >
                <option>Aptitude</option>
                <option>Technical</option>
                <option>Coding</option>
                <option>HR</option>
                <option>System Design</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Year</label>
              <input
                type="number"
                placeholder="2025"
                value={placementYear}
                onChange={(e) => setPlacementYear(e.target.value)}
                className="input-control"
                required
              />
            </div>
          </div>
        </>
      ) : (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Topic</label>
          <input
            type="text"
            placeholder="e.g. Recursion, SQL Joins"
            value={placementTopic}
            onChange={(e) => setPlacementTopic(e.target.value)}
            className="input-control"
          />
        </div>
      )}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
          Question{isBulkMode ? "s (Paste multiple questions separated by Q1, Q2, etc.)" : ""}
        </label>
        <textarea
          placeholder={isBulkMode ? "Q1. What is React?\nQ2. What is Node.js?" : "Enter the interview question..."}
          value={placementQuestion}
          onChange={(e) => setPlacementQuestion(e.target.value)}
          className="input-control"
          style={{ height: isBulkMode ? "150px" : "100px" }}
        />
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
          Correct Answer / Hint{isBulkMode ? "s (Paste matching hints separated by A1, A2, etc.)" : ""}
        </label>
        <textarea
          placeholder={isBulkMode ? "A1. A UI Library.\nA2. A JS runtime environment." : "Enter the solution or explanation..."}
          value={placementAnswer}
          onChange={(e) => setPlacementAnswer(e.target.value)}
          className="input-control"
          style={{ height: isBulkMode ? "150px" : "100px" }}
        />
      </div>

      <button
        type="submit"
        className={`primary-btn ${placementLoading ? "loading" : ""}`}
        style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, var(--warning), var(--accent-secondary))" }}
        disabled={placementLoading}
      >
        {placementLoading ? "Saving..." : "Save Placement Question"}
      </button>
    </form>
  );
}

export default PlacementForm;
