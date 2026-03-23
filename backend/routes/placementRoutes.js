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

// GET /api/placement - Fetch questions
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    if (isSupabaseConfigured()) {
      let query = supabase.from("placement_questions").select("*");
      if (category) query = query.eq("category", category);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (!error) return res.json(data);
    }
    let local = readLocal();
    if (category) local = local.filter(q => q.category === category);
    res.json(local.reverse());
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/placement/add - Add question
router.post("/add", async (req, res) => {
  try {
    const { category, topic, question, answer, userId } = req.body;
    if (!category || !topic || !question || !answer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQ = {
      category,
      topic,
      question,
      answer,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("placement_questions")
        .insert([newQ])
        .select();
      if (!error) return res.status(201).json(data[0]);
    }

    const local = readLocal();
    const localQ = { ...newQ, id: Date.now().toString() };
    local.push(localQ);
    writeLocal(local);
    res.status(201).json(localQ);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
