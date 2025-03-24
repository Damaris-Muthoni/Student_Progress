const express = require("express");
const {
  loginInstitution,
  changePassword,
  validateToken,
} = require("../controllers/authControllers");
const { validateAuthToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginInstitution);
router.post("/change-password", validateAuthToken, changePassword);
router.post("/validate-token", validateAuthToken);
module.exports = router;
