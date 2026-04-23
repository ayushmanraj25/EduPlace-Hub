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

// ✅ Auto-Wakeup Supabase (Only works if project is Active, not Paused)
const supabase = require("./config/supabase");

(async () => {
  try {
    console.log("Checking Supabase connection...");
    const { error } = await supabase.from("notes").select("id").limit(1);
    if (error) {
      console.warn("Supabase ping warning:", error.message);
    } else {
      console.log("Supabase is connected and ready ✅");
    }
  } catch (err) {
    console.error("Supabase connection failed! (Please check if Project is Paused on Supabase Dashboard):", err.message);
  }
})();