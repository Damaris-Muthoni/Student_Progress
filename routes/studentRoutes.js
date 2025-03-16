const express = require("express");
const { registerStudent } = require("../controllers/studentControllers"); // ✅ Correct Import
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ Ensure Middleware Exists
const { uploadCertificate } = require("../controllers/studentControllers");
const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const router = express.Router();

// ✅ Correct Route
router.post("/register", authMiddleware, registerStudent);
router.post(
  "/upload-certificate",
  authenticate,
  upload.single("certificate"),
  uploadCertificate
);
module.exports = router;
