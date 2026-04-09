const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const supabase = require("../config/supabase");

// Map Supabase snake_case to frontend camelCase
function mapNote(note) {
  return {
    _id: note.id,
    userId: note.user_id,
    subject: note.subject,
    topic: note.topic,
    content: note.content,
    fileUrl: note.file_url,
    fileName: note.file_name,
    fileSize: note.file_size,
    createdAt: note.created_at
  };
}

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx", ".txt", ".ppt", ".pptx", ".png", ".jpg", ".jpeg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, TXT, PPT, and image files are allowed."));
    }
  }
});

// POST /api/notes/add - Add a text note
router.post("/add", async (req, res) => {
  try {
    const { subject, topic, content, userId } = req.body;

    if (!subject || !topic || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Saving note to Supabase...");
    const { data, error } = await supabase
      .from('notes')
      .insert([{ subject, topic, content, user_id: userId || 'anonymous' }])
      .select();

    if (error) {
      console.error("Supabase save error:", error.message);
      return res.status(500).json({ message: "Failed to save note: " + error.message });
    }

    console.log("Note saved to Supabase ✅");
    res.status(201).json({ message: "Note saved successfully!", note: mapNote(data[0]) });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// POST /api/notes/upload - Upload a file note
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const { subject, topic, userId } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ message: "Subject and Topic are required." });
    }

    const fileUrl = "/uploads/" + req.file.filename;

    console.log("Saving file record to Supabase...");
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        subject,
        topic,
        user_id: userId,
        content: `[File Upload] ${req.file.originalname}`,
        file_url: fileUrl,
        file_name: req.file.originalname,
        file_size: req.file.size,
      }])
      .select();

    if (error) {
      console.error("Supabase upload save error:", error.message);
      return res.status(500).json({ message: "Failed to save file record: " + error.message });
    }

    console.log("File record saved to Supabase ✅");
    res.status(201).json({ message: "File uploaded successfully!", note: mapNote(data[0]) });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
});

// GET /api/notes - Get all notes
router.get("/", async (req, res) => {
  try {
    console.log("Fetching notes from Supabase...");
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase read error:", error.message);
      return res.status(500).json({ message: "Failed to fetch notes: " + error.message });
    }

    console.log(`Fetched ${data.length} notes from Supabase ✅`);
    res.json(data.map(mapNote));
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
