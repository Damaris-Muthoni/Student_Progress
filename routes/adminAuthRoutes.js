const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require("../controllers/adminAuthControllers");
const { validateAuthToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin); // Create an admin
router.post("/login", loginAdmin); // Admin login
router.get("/profile", validateAuthToken, isAdmin, getAdminProfile); // Admin profile

module.exports = router;
