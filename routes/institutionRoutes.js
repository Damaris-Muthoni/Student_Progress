const express = require("express");
const {
  registerInstitution,
  getSchoolDetails,
} = require("../controllers/institutionControllers");

const router = express.Router();

router.post("/register", registerInstitution);
router.post("/details");

router.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = router;
