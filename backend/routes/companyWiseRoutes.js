const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /api/company-wise - Fetch questions with optional filters
router.get("/", async (req, res) => {
  try {
    const { company, type, year } = req.query;

    let query = supabase.from("company_questions").select("*");

    if (company) query = query.ilike("company", company);
    if (type) query = query.eq("type", type);
    if (year) query = query.eq("year", parseInt(year));

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error.message);
      return res.status(500).json({ message: "Failed to fetch questions: " + error.message });
    }

    console.log(`Fetched ${data.length} company questions ✅`);
    res.json(data);
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

    console.log("Saving company question to Supabase...");
    const { data, error } = await supabase
      .from("company_questions")
      .insert([{
        company,
        type,
        question,
        answer,
        year: parseInt(year),
      }])
      .select();

    if (error) {
      console.error("Supabase POST error:", error.message);
      return res.status(500).json({ message: "Failed to save question: " + error.message });
    }

    console.log("Company question saved to Supabase ✅");
    res.status(201).json(data[0]);
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

    const { data, error } = await supabase
      .from("company_questions")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase UPDATE error:", error.message);
      return res.status(500).json({ message: "Failed to update: " + error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE /api/company-wise/:id - Delete question
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("company_questions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase DELETE error:", error.message);
      return res.status(500).json({ message: "Failed to delete: " + error.message });
    }

    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
