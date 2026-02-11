const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  subject: String,
  topic: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);
