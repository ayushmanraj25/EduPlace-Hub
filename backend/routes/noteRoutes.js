const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const supabase = require("../config/supabase");

// Local JSON file fallback
const DATA_FILE = path.join(__dirname, "..", "data", "notes.json");

function readLocalNotes() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch (e) { }
  return [];
}

function writeLocalNotes(notes) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes("your_supabase_url") && !key.includes("your_supabase_anon") && supabase);
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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

    // Try Supabase first
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('notes')
          .insert([{ subject, topic, content, user_id: userId }])
          .select();
        
        if (!error) {
          return res.status(201).json({ message: "Note saved successfully to Supabase!", note: mapNote(data[0]) });
        }
        console.warn("Supabase save failed, falling back to local:", error.message);
      } catch (dbErr) {
        console.warn("Supabase save error, falling back to local:", dbErr.message);
      }
    }

    // Fallback to local JSON
    const notes = readLocalNotes();
    const newNote = {
      _id: Date.now().toString(),
      userId,
      subject,
      topic,
      content,
      createdAt: new Date().toISOString()
    };
    notes.push(newNote);
    writeLocalNotes(notes);

    res.status(201).json({ message: "Note saved successfully (local storage)!", note: newNote });
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
    
    // Supabase data (snake_case)
    const supabaseData = {
      subject,
      topic,
      user_id: userId,
      content: `[File Upload] ${req.file.originalname}`,
      file_url: fileUrl,
      file_name: req.file.originalname,
      file_size: req.file.size,
    };

    // Try Supabase first
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('notes')
          .insert([supabaseData])
          .select();
        
        if (!error) {
          return res.status(201).json({ message: "File uploaded successfully!", note: mapNote(data[0]) });
        }
        console.warn("Supabase upload data save failed, falling back to local:", error.message);
      } catch (dbErr) {
        console.warn("Supabase upload data save error, falling back to local:", dbErr.message);
      }
    }

    // Fallback to local JSON
    const notes = readLocalNotes();
    const newNote = { 
      _id: Date.now().toString(), 
      userId,
      subject, 
      topic, 
      content: supabaseData.content,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      createdAt: new Date().toISOString() 
    };
    notes.push(newNote);
    writeLocalNotes(notes);

    res.status(201).json({ message: "File uploaded successfully (local)!", note: newNote });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
});

// GET /api/notes - Get all notes
router.get("/", async (req, res) => {
  try {
    // Try Supabase first
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error) return res.json(data.map(mapNote));
        console.warn("Supabase read failed, falling back to local:", error.message);
      } catch (dbErr) {
        console.warn("Supabase read error, falling back to local:", dbErr.message);
      }
    }

    // Fallback to local JSON
    const notes = readLocalNotes().reverse();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
