const express = require("express");
const {
  loginInstitution,
  changePassword,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/login", loginInstitution);
router.post("/change-password", changePassword);

module.exports = router;
