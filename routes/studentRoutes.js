const express = require("express");
const {
  registerStudent,
  uploadCertificate,
} = require("../controllers/studentControllers"); // ✅ Correct Import
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ Ensure Middleware Exists

const upload = require("../middleware/multer");

const router = express.Router();

// ✅ Correct Route
router.post("/register", authMiddleware, registerStudent);
router.post(
  "/upload-certificate",
  authMiddleware,
  upload.single("certificate"),
  uploadCertificate
);
module.exports = router;
