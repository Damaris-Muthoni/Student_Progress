const express = require("express");
const {
  registerInstitution,
} = require("../controllers/institutionControllers");

const router = express.Router();

router.post("/register", registerInstitution);

router.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = router;
