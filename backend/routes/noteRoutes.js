const express = require("express");
const router = express.Router();
// Multer ek middleware hai jo Node.js (Express) me file upload handle karta hai
// Ye frontend se aayi file (PDF, image, etc.) ko receive karke server me save karta hai
// Aur req.file ya req.files ke through us file ka data access karne deta hai

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const supabase = require("../config/supabase");

const DATA_FILE = path.join(__dirname, "..", "data", "notes.json");

function readLocal() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch (e) {}
  return [];
}

function writeLocal(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

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
    const newNote = {
      id: Date.now().toString(),
      subject,
      topic,
      content,
      user_id: userId || 'anonymous',
      created_at: new Date().toISOString()
    };

    try {
      console.log("Saving note to Supabase...");
      const { data, error } = await supabase
        .from('notes')
        .insert([{ subject, topic, content, user_id: userId || 'anonymous' }])
        .select();

      if (!error && data && data.length > 0) {
        console.log("Note saved to Supabase ✅");
        return res.status(201).json({ message: "Note saved successfully!", note: mapNote(data[0]) });
      }
      console.error("Supabase save error:", error ? error.message : "unknown");
    } catch (err) {
      console.error("Supabase Exception:", err.message);
    }
    
    console.log("Falling back to local storage for note...");
    const local = readLocal();
    local.push(newNote);
    writeLocal(local);
    res.status(201).json({ message: "Note saved locally! (Supabase failed)", note: mapNote(newNote) });
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
    const newNote = {
      id: Date.now().toString(),
      subject,
      topic,
      user_id: userId || 'anonymous',
      content: `[File Upload] ${req.file.originalname}`,
      file_url: fileUrl,
      file_name: req.file.originalname,
      file_size: req.file.size,
      created_at: new Date().toISOString()
    };

    try {
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

      if (!error && data && data.length > 0) {
        console.log("File record saved to Supabase ✅");
        return res.status(201).json({ message: "File uploaded successfully!", note: mapNote(data[0]) });
      }
      console.error("Supabase upload save error:", error ? error.message : "unknown");
    } catch (err) {
      console.error("Supabase Exception:", err.message);
    }

    console.log("Falling back to local storage for file note...");
    const local = readLocal();
    local.push(newNote);
    writeLocal(local);
    res.status(201).json({ message: "File uploaded locally! (Supabase failed)", note: mapNote(newNote) });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
});
// GET /api/notes - Get all notes
router.get("/", async (req, res) => {
  try {
    try {
      console.log("Fetching notes from Supabase...");
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        console.log(`Fetched ${data.length} notes from Supabase ✅`);
        return res.json(data.map(mapNote));
      }
      console.error("Supabase read error:", error ? error.message : "unknown");
    } catch (err) {
      console.error("Supabase Exception:", err.message);
    }

    console.log("Falling back to local storage for notes...");
    const local = readLocal();
    res.json(local.reverse().map(mapNote));
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
