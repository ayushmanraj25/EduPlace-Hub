const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "placement.json");

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

function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes("your_supabase_url") && !key.includes("your_supabase_anon") && supabase);
}

// GET /api/placement - Fetch questions by category
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from("placement_questions").select("*");
        if (category) query = query.eq("category", category);
        const { data, error } = await query.order("created_at", { ascending: false });
        if (!error) return res.json(data);
        console.error("Supabase GET error:", error.message);
      } catch (err) {
        console.error("Supabase Exception:", err.message);
      }
    }
    let local = readLocal();
    if (category) local = local.filter(q => q.category === category);
    res.json(local.reverse());
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/placement/company/:company - Fetch questions for a specific company
router.get("/company/:company", async (req, res) => {
  try {
    const { company } = req.params;
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("placement_questions")
          .select("*")
          .eq("category", "Company Wise")
          .ilike("company", company)
          .order("created_at", { ascending: false });
        if (!error) return res.json(data);
        console.error("Supabase company GET error:", error.message);
      } catch (err) {
        console.error("Supabase Exception:", err.message);
      }
    }
    // Fallback to local JSON
    let local = readLocal();
    local = local.filter(q => q.category === "Company Wise" && q.company && q.company.toLowerCase() === company.toLowerCase());
    res.json(local.reverse());
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/placement/companies - Get list of all companies that have questions
router.get("/companies", async (req, res) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("placement_questions")
          .select("company")
          .eq("category", "Company Wise")
          .not("company", "is", null);
        if (!error) {
          const unique = [...new Set(data.map(d => d.company))];
          return res.json(unique);
        }
      } catch (err) {
        console.error("Supabase Exception:", err.message);
      }
    }
    let local = readLocal();
    const unique = [...new Set(local.filter(q => q.company).map(q => q.company))];
    res.json(unique);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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

// POST /api/placement/add - Add question
router.post("/add", async (req, res) => {
  try {
    const { category, topic, question, answer, userId, company, role } = req.body;
    if (!category || !topic || !question || !answer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (category === "Company Wise" && !company) {
      return res.status(400).json({ message: "Company name is required for Company Wise questions" });
    }

    const newQ = {
      id: Date.now().toString(),
      type: "placement",
      category,
      topic,
      question,
      answer,
      company: category === "Company Wise" ? company : null,
      user_id: userId || 'anonymous',
      created_at: new Date().toISOString()
    };

    if (role === "admin") {
      if (isSupabaseConfigured()) {
        try {
          console.log("Admin uploading: Attempting to save placement question to Supabase...");
          const { data, error } = await supabase
            .from("placement_questions")
            .insert([{
              category: newQ.category, topic: newQ.topic, question: newQ.question, 
              answer: newQ.answer, company: newQ.company, user_id: newQ.user_id
            }])
            .select();
          if (!error && data && data.length > 0) {
            console.log("Placement question saved to Supabase ✅");
            return res.status(201).json(data[0]);
          }
          console.error("Supabase INSERT failed:", error ? error.message : "No data returned", " - Falling back to local storage.");
        } catch (dbErr) {
          console.error("Supabase INSERT error (exception):", dbErr.message, " - Falling back to local storage.");
        }
      } else {
        console.log("Supabase not configured for placement questions. Using local storage.");
      }
    } else {
      console.log("User uploading placement Q: Sending to pending queue...");
      const pending = readPending();
      pending.push(newQ);
      writePending(pending);
      return res.status(201).json({ message: "Question submitted for admin approval! ⏳", data: newQ });
    }

    const local = readLocal();
    const localQ = { ...newQ, id: Date.now().toString() };
    local.push(localQ);
    writeLocal(local);
    res.status(201).json(localQ);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
