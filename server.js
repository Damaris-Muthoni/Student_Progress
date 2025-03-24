require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
path = require("path");

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoute");
const institutionRoutes = require("./routes/institutionRoutes");
const adminActionControllers = require("./routes/adminActionRoutes");
const adminAuthControllers = require("./routes/adminAuthRoutes");

const app = express();
app.use((err, req, res, next) => {
  console.error("❌ Error:", err); // Log full error to console
  res.status(500).json({
    message: "Server error",
    error: err.message || "Unknown error", // Send error details in response
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/certificates", express.static(path.join(__dirname, "certificates")));

// Connect to MongoDB
connectDB();

app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/institutions", institutionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin/auth", adminAuthControllers);
app.use("/api/admin/actins", adminActionControllers);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
