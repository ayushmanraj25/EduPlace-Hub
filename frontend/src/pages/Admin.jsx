import { useState } from "react";

function Admin() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSubject, setUploadSubject] = useState("");
  const [uploadTopic, setUploadTopic] = useState("");
  const [uploading, setUploading] = useState(false);

  // Placement State
  const [placementCategory, setPlacementCategory] = useState("Aptitude");
  const [placementTopic, setPlacementTopic] = useState("");
  const [placementQuestion, setPlacementQuestion] = useState("");
  const [placementAnswer, setPlacementAnswer] = useState("");
  const [placementLoading, setPlacementLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadSubject.trim() || !uploadTopic.trim()) {
      alert("Please select a file and fill Subject & Topic");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("subject", uploadSubject.trim());
      formData.append("topic", uploadTopic.trim());

       formData.append("userId", user.email);
 
      const response = await fetch("http://localhost:5001/api/notes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setNotesList((prev) => [...prev, {
        type: "file",
        subject: uploadSubject.trim(),
        topic: uploadTopic.trim(),
        fileName: uploadFile.name,
        fileSize: uploadFile.size,
      }]);
      alert("File uploaded successfully ✅");

      setUploadFile(null);
      setUploadSubject("");
      setUploadTopic("");
      // Reset file input
      const fileInput = document.getElementById("file-upload-input");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed ❌ " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddPlacement = async (e) => {
    e.preventDefault();
    if (!placementTopic.trim() || !placementQuestion.trim() || !placementAnswer.trim()) {
      alert("Please fill all placement fields");
      return;
    }

    setPlacementLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/placement/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: placementCategory,
          topic: placementTopic.trim(),
          question: placementQuestion.trim(),
          answer: placementAnswer.trim(),
          userId: user.email
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save question");

      setNotesList(prev => [...prev, {
        type: "placement",
        subject: placementCategory,
        topic: placementTopic.trim(),
        note: placementQuestion.trim().substring(0, 100) + "..."
      }]);

      alert("Placement question saved ✅");
      setPlacementTopic("");
      setPlacementQuestion("");
      setPlacementAnswer("");
    } catch (error) {
      console.error(error);
      alert("Failed to save placement question ❌");
    } finally {
      setPlacementLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="page-container">
      <div className="animate-slide-up" style={{ marginBottom: "40px" }}>
        <h2 className="gradient-text" style={{ fontSize: "38px", marginBottom: "10px" }}>Admin Dashboard</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
          Manage platform content — upload text notes or PDF/document files.
        </p>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* LEFT COLUMN: FORMS */}
        <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* TEXT NOTE FORM */}
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
              />
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
              className={`primary-btn ${loading ? 'loading' : ''}`}
              style={{ width: "100%", padding: "14px" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Text Note"}
            </button>
          </form>

          {/* FILE UPLOAD FORM */}
          <form
            onSubmit={handleFileUpload}
            className="glass-panel animate-slide-up delay-200"
            style={{ padding: "30px" }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "24px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--accent-secondary)" }}>📎</span> Upload PDF / File
            </h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Subject</label>
              <input
                type="text"
                placeholder="e.g. Operating System"
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="input-control"
                disabled={uploading}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Topic</label>
              <input
                type="text"
                placeholder="e.g. Process Scheduling"
                value={uploadTopic}
                onChange={(e) => setUploadTopic(e.target.value)}
                className="input-control"
                disabled={uploading}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Choose File</label>
              <div
                style={{
                  border: "2px dashed var(--glass-border)",
                  borderRadius: "12px",
                  padding: "30px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "var(--card-highlight)",
                  transition: "all 0.2s ease",
                }}
                onClick={() => document.getElementById("file-upload-input").click()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.png,.jpg,.jpeg"
                  style={{ display: "none" }}
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  disabled={uploading}
                />
                {uploadFile ? (
                  <div>
                    <span style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>📄</span>
                    <p style={{ color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>{uploadFile.name}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{formatFileSize(uploadFile.size)}</p>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: "32px", display: "block", marginBottom: "8px", opacity: 0.5 }}>☁️</span>
                    <p style={{ color: "var(--text-muted)", marginBottom: "4px" }}>Click to browse or drag & drop</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>PDF, DOC, TXT, PPT, Images (Max: 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`primary-btn ${uploading ? 'loading' : ''}`}
              style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))" }}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </form>
 
          {/* PLACEMENT QUESTION FORM */}
          <form
            onSubmit={handleAddPlacement}
            className="glass-panel animate-slide-up delay-300"
            style={{ padding: "30px" }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "24px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--warning)" }}>💼</span> Add Placement Question
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
              </select>
            </div>
 
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
 
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Question</label>
              <textarea
                placeholder="Enter the interview question..."
                value={placementQuestion}
                onChange={(e) => setPlacementQuestion(e.target.value)}
                className="input-control"
                style={{ height: "100px" }}
              />
            </div>
 
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Correct Answer / Hint</label>
              <textarea
                placeholder="Enter the solution or explanation..."
                value={placementAnswer}
                onChange={(e) => setPlacementAnswer(e.target.value)}
                className="input-control"
                style={{ height: "100px" }}
              />
            </div>
 
            <button
              type="submit"
              className={`primary-btn ${placementLoading ? 'loading' : ''}`}
              style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, var(--warning), var(--accent-secondary))" }}
              disabled={placementLoading}
            >
              {placementLoading ? "Saving..." : "Save Placement Question"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div style={{ flex: "1 1 500px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "var(--text-primary)" }}>Session Activity</h3>

          {notesList.length === 0 ? (
             <div className="glass-panel animate-fade-in" style={{ padding: "40px", textAlign: "center", borderStyle: "dashed", borderColor: "var(--glass-border)" }}>
               <span style={{ fontSize: "40px", display: "block", marginBottom: "10px", opacity: 0.5 }}>📝</span>
               <p style={{ color: "var(--text-muted)" }}>No notes or files uploaded in this session.</p>
             </div>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {notesList.map((item, index) => (
                <div
                  key={index}
                  className="glass-panel animate-slide-up"
                  style={{ 
                    padding: "20px", 
                    borderLeft: `4px solid ${
                      item.type === "file" ? "var(--accent-secondary)" : 
                      item.type === "placement" ? "var(--warning)" : "var(--success)"
                    }`, 
                    animationDelay: `${index * 50}ms` 
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h4 style={{ color: "var(--accent-primary)", margin: 0 }}>{item.subject}</h4>
                    <span style={{
                      background: item.type === "file" ? "rgba(255, 119, 51, 0.1)" : "rgba(16, 185, 129, 0.1)",
                      color: item.type === "file" ? "var(--accent-secondary)" : 
                             item.type === "placement" ? "var(--warning)" : "var(--success)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      {item.type === "file" ? "📎 File" : 
                       item.type === "placement" ? "💼 Q&A" : "✓ Text"}
                    </span>
                  </div>
                  <strong style={{ display: "block", fontSize: "18px", color: "var(--text-primary)", marginBottom: "8px" }}>{item.topic}</strong>
                  {item.type === "file" ? (
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
                      {item.fileName} ({formatFileSize(item.fileSize)})
                    </p>
                  ) : (
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", whiteSpace: "pre-wrap", margin: 0, opacity: 0.8 }}>
                      {item.note.length > 150 ? item.note.substring(0, 150) + "..." : item.note}
                    </p>
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

export default Admin;
