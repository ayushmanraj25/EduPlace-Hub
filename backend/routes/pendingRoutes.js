const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabase");

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

// GET /api/pending - Fetch all pending items
router.get("/", (req, res) => {
  const pending = readPending();
  res.json(pending);
});

// GET /api/pending/user/:email - Fetch pending items for a user
router.get("/user/:email", (req, res) => {
  const { email } = req.params;
  const pending = readPending();
  const userPending = pending.filter(item => item.user_id === email);
  res.json(userPending);
});

// DELETE /api/pending/:id/reject - Reject a pending item
router.delete("/:id/reject", (req, res) => {
  const { id } = req.params;
  let pending = readPending();
  pending = pending.filter(item => item.id !== id && item.id !== Number(id));
  writePending(pending);
  res.json({ message: "Item rejected and deleted." });
});

// PUT /api/pending/:id/approve - Approve and move to Supabase
router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;
  let pending = readPending();
  const index = pending.findIndex(item => item.id === id || item.id === Number(id));
  
  if (index === -1) {
    return res.status(404).json({ message: "Item not found in pending queue." });
  }

  const item = pending[index];
  let tableName = "";
  let payload = {};

  if (item.type === "note" || item.type === "file") {
    tableName = "notes";
    payload = {
      subject: item.subject,
      topic: item.topic,
      content: item.content,
      user_id: item.user_id,
      file_url: item.file_url || null,
      file_name: item.file_name || null,
      file_size: item.file_size || null,
      created_at: item.created_at
    };
  } else if (item.type === "placement") {
    tableName = "placement_questions";
    payload = {
      category: item.category,
      topic: item.topic,
      question: item.question,
      answer: item.answer,
      company: item.company || null,
      user_id: item.user_id,
      created_at: item.created_at
    };
  } else if (item.type === "company") {
    tableName = "company_questions";
    payload = {
      company: item.company,
      type: item.question_type,
      question: item.question,
      answer: item.answer,
      year: item.year,
      user_id: item.user_id,
      created_at: item.created_at
    };
  }

  try {
    const { data, error } = await supabase.from(tableName).insert([payload]).select();
    
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ message: "Failed to insert into Supabase: " + error.message });
    }

    // Remove from pending
    pending.splice(index, 1);
    writePending(pending);

    res.json({ message: "Item approved and published!", data: data[0] });
  } catch (error) {
    console.error("Approve error:", error);
    res.status(500).json({ message: "Server error during approval." });
  }
});

module.exports = router;
