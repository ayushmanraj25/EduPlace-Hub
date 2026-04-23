import React, { useState } from "react";

function FileUploadForm({ user, setNotesList }) {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSubject, setUploadSubject] = useState("");
  const [uploadTopic, setUploadTopic] = useState("");
  const [uploading, setUploading] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
      setNotesList((prev) => [
        ...prev,
        {
          type: "file",
          subject: uploadSubject.trim(),
          topic: uploadTopic.trim(),
          fileName: uploadFile.name,
          fileSize: uploadFile.size,
        },
      ]);
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

  return (
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
          list="subject-options"
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
        className={`primary-btn ${uploading ? "loading" : ""}`}
        style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))" }}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </form>
  );
}

export default FileUploadForm;
