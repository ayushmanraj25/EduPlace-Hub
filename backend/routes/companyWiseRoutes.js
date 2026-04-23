const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "company_wise.json");

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

// GET /api/company-wise - Fetch questions with optional filters
router.get("/", async (req, res) => {
  try {
    const { company, type, year } = req.query;
    
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from("company_questions").select("*");
        if (company) query = query.ilike("company", `${company}%`);
        if (type) query = query.eq("type", type);
        if (year) query = query.eq("year", parseInt(year));
        const { data, error } = await query.order("created_at", { ascending: false });

        if (!error) {
          console.log(`Fetched ${data.length} company questions from Supabase ✅`);
          return res.json(data);
        }
        console.error("Supabase GET error:", error.message, " - Falling back to local storage");
      } catch (err) {
        console.error("Supabase Exception:", err.message, " - Falling back to local storage");
      }
    }
    
    let local = readLocal();
    if (company) local = local.filter(q => q.company && q.company.toLowerCase().includes(company.toLowerCase()));
    if (type) local = local.filter(q => q.type === type);
    if (year) local = local.filter(q => q.year === parseInt(year));
    
    res.json(local.reverse());
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/company-wise - Add new question
router.post("/", async (req, res) => {
  try {
    const { company, type, question, answer, year } = req.body;
    if (!company || !type || !question || !answer || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQ = {
      company,
      type,
      question,
      answer,
      year: parseInt(year),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        console.log("Saving company question to Supabase...");
        const { data, error } = await supabase
          .from("company_questions")
          .insert([newQ])
          .select();
        
        if (!error && data && data.length > 0) {
          console.log("Company question saved to Supabase ✅");
          return res.status(201).json(data[0]);
        }
        console.error("Supabase POST error:", error ? error.message : "No data returned", " - Falling back to local storage");
      } catch (err) {
        console.error("Supabase Exception:", err.message, " - Falling back to local storage");
      }
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

// PUT /api/company-wise/:id - Update question
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("company_questions")
          .update(updateData)
          .eq("id", id)
          .select();
        if (!error && data && data.length > 0) {
          return res.json(data[0]);
        }
      } catch (err) {}
    }

    // fallback
    let local = readLocal();
    const index = local.findIndex(q => q.id === id || q.id === Number(id) || q.id === String(id));
    if (index !== -1) {
      local[index] = { ...local[index], ...updateData };
      writeLocal(local);
      return res.json(local[index]);
    }
    res.status(404).json({ message: "Question not found locally" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE /api/company-wise/:id - Delete question
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from("company_questions")
          .delete()
          .eq("id", id);
        if (!error) {
          return res.json({ message: "Question deleted" });
        }
      } catch (err) {}
    }

    // fallback
    let local = readLocal();
    local = local.filter(q => q.id !== id && q.id !== Number(id) && q.id !== String(id));
    writeLocal(local);
    res.json({ message: "Question deleted locally" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
