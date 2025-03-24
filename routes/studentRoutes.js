const express = require("express");
const {
  registerStudent,
  uploadCertificate,
} = require("../controllers/studentControllers"); // ✅ Correct Import
const { validateAuthToken } = require("../middleware/authMiddleware"); // ✅ Ensure Middleware Exists

const upload = require("../middleware/multer");

const router = express.Router();

// ✅ Correct Route
router.post("/register", validateAuthToken, registerStudent);
router.post(
  "/upload-certificate",
  validateAuthToken,
  upload.single("certificate"),
  uploadCertificate
);
module.exports = router;
