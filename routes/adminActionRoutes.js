const express = require("express");
const { validateAuthToken, isAdmin } = require("../middleware/authMiddleware");
const {
  getStudentById,
  getStudentsBySchool,
  addStudent,
  deleteStudent,
  getStatistics,
} = require("../controllers/adminActionsControllers");

const router = express.Router();

router.get("/student/:id", validateAuthToken, isAdmin, getStudentById);
router.get(
  "/school/:schoolId/students",
  validateAuthToken,
  isAdmin,
  getStudentsBySchool
);
router.post("/student", validateAuthToken, isAdmin, addStudent);
router.delete("/student/:id", validateAuthToken, isAdmin, deleteStudent);
router.get("/stats", validateAuthToken, isAdmin, getStatistics);

module.exports = router;
