const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Add Note
router.post("/add", async (req, res) => {
  const { subject, topic, content } = req.body;

  const newNote = new Note({ subject, topic, content });
  await newNote.save();

  res.json({ message: "Note saved successfully" });
});

// Get All Notes
router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

module.exports = router;
