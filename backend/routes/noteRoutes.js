const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

router.post("/add", async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const { subject, topic, content } = req.body;

    if (!subject || !topic || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNote = new Note({
      subject,
      topic,
      content,
    });

    await newNote.save();

    res.status(201).json({ message: "Note saved successfully" });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
