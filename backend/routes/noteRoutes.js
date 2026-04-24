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
// Helper to save to pending queue
const PENDING_FILE = path.join(__dirname, "..", "data", "pending.json");
function readPending() {
  try {
    if (fs.existsSync(PENDING_FILE)) {
      return JSON.parse(fs.readFileSync(PENDING_FILE, "utf-8"));
    }
  } catch (e) {}
  return [];
}
function writePending(data) {
  const dir = path.dirname(PENDING_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2));
}

// POST /api/notes/add - Add a text note
router.post("/add", async (req, res) => {
  try {
    const { subject, topic, content, userId, role } = req.body;
    if (!subject || !topic || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNote = {
      id: Date.now().toString(),
      type: "note",
      subject,
      topic,
      content,
      user_id: userId || 'anonymous',
      created_at: new Date().toISOString()
    };

    if (role === "admin") {
      try {
        console.log("Admin uploading: Saving directly to Supabase...");
        const { data, error } = await supabase
          .from('notes')
          .insert([{ subject, topic, content, user_id: userId || 'anonymous' }])
          .select();

        if (!error && data && data.length > 0) {
          return res.status(201).json({ message: "Note saved directly to database!", note: mapNote(data[0]) });
        }
      } catch (err) {}
    } else {
      console.log("User uploading: Sending to pending queue...");
      const pending = readPending();
      pending.push(newNote);
      writePending(pending);
      return res.status(201).json({ message: "Note submitted for admin approval! ⏳", note: newNote });
    }
    
    // Fallback if admin insert failed
    const local = readLocal();
    local.push(newNote);
    writeLocal(local);
    res.status(201).json({ message: "Note saved locally!", note: mapNote(newNote) });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});
// POST /api/notes/upload - Upload a file note
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const { subject, topic, userId, role } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ message: "Subject and Topic are required." });
    }
    const fileUrl = "/uploads/" + req.file.filename;
    
    const newNote = {
      id: Date.now().toString(),
      type: "file",
      subject,
      topic,
      user_id: userId || 'anonymous',
      content: `[File Upload] ${req.file.originalname}`,
      file_url: fileUrl,
      file_name: req.file.originalname,
      file_size: req.file.size,
      created_at: new Date().toISOString()
    };

    if (role === "admin") {
      try {
        console.log("Admin uploading file: Saving to Supabase...");
        const { data, error } = await supabase
          .from('notes')
          .insert([{
            subject, topic, user_id: userId || 'anonymous',
            content: `[File Upload] ${req.file.originalname}`,
            file_url: fileUrl, file_name: req.file.originalname, file_size: req.file.size
          }]).select();

        if (!error && data && data.length > 0) {
          return res.status(201).json({ message: "File uploaded successfully!", note: mapNote(data[0]) });
        }
      } catch (err) {}
    } else {
      console.log("User uploading file: Sending to pending queue...");
      const pending = readPending();
      pending.push(newNote);
      writePending(pending);
      return res.status(201).json({ message: "File submitted for admin approval! ⏳", note: newNote });
    }

    const local = readLocal();
    local.push(newNote);
    writeLocal(local);
    res.status(201).json({ message: "File uploaded locally!", note: mapNote(newNote) });
  } catch (error) {
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
});

// GET /api/notes - Get notes
router.get("/", async (req, res) => {
  try {
    try {
      console.log("Fetching notes from Supabase...");
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.json(data.map(mapNote));
      }
    } catch (err) {}

    const local = readLocal();
    res.json(local.reverse().map(mapNote));
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/notes/user/:userId - Get notes uploaded by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.json(data.map(mapNote));
      }
    } catch (err) {}

    let local = readLocal();
    local = local.filter(n => n.user_id === userId);
    res.json(local.reverse().map(mapNote));
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
