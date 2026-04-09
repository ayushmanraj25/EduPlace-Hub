const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default route
app.get("/", (req, res) => {
  res.send("EduPlace Hub Backend with Supabase Running");
});

// Routes
const noteRoutes = require("./routes/noteRoutes");
app.use("/api/notes", noteRoutes);


const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const placementRoutes = require("./routes/placementRoutes");
app.use("/api/placement", placementRoutes);

const companyWiseRoutes = require("./routes/companyWiseRoutes");
app.use("/api/company-wise", companyWiseRoutes);

// ✅ Proper Port Handling
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// cd backend
// npx nodemon server.js


// cd frontend
// npm start