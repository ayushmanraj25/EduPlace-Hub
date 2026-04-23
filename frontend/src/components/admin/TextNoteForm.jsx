import React, { useState } from "react";

function TextNoteForm({ user, setNotesList, availableSubjects }) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !topic.trim() || !note.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/notes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject.trim(),
          topic: topic.trim(),
          content: note.trim(),
          userId: user.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save note");
      }
      setNotesList((prev) => [...prev, {
        type: "text",
        subject: subject.trim(),
        topic: topic.trim(),
        note: note.trim(),
      }]);
      alert("Note saved successfully ✅");

      setSubject("");
      setTopic("");
      setNote("");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note ❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAddNote}
      className="glass-panel animate-slide-up delay-100"
      style={{ padding: "30px" }}
    >
      <h3 style={{ fontSize: "20px", marginBottom: "24px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ color: "var(--accent-primary)" }}>✏️</span> Add Text Note
      </h3>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Subject</label>
        <input
          type="text"
          placeholder="e.g. DBMS, Data Structures"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-control"
          disabled={loading}
          list="subject-options"
        />
        <datalist id="subject-options">
          {availableSubjects.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Topic</label>
        <input
          type="text"
          placeholder="e.g. Normalization, Binary Trees"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="input-control"
          disabled={loading}
        />
      </div>
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Note Content</label>
        <textarea
          placeholder="Write detailed notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-control"
          style={{ height: "130px", resize: "vertical" }}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className={`primary-btn ${loading ? "loading" : ""}`}
        style={{ width: "100%", padding: "14px" }}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Text Note"}
      </button>
    </form>
  );
}

export default TextNoteForm;
