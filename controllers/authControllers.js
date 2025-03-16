const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Institution } = require("../models/institution");

const SECRET_KEY = process.env.JWT_SECRET ; // Store securely in .env

// Institution Login
exports.loginInstitution = async (req, res) => {
  try {
    const { schoolId, password } = req.body;
    const institution = await Institution.findOne({ schoolId });

    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    const isMatch = await bcrypt.compare(password, institution.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Force password change if still using default password
    // if (!institution.passwordChanged) {
    //   return res.status(403).json({ message: "Password change required" });
    // }

    const token = jwt.sign(
      { id: institution._id, schoolId: institution.schoolId },
      SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Change Password (First-time Login)
exports.changePassword = async (req, res) => {
  try {
    const { schoolId, newPassword } = req.body;
    const institution = await Institution.findOne({ schoolId });

    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    if (institution.passwordChanged) {
      return res.status(400).json({ message: "Password already changed" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    institution.password = hashedPassword;
    institution.passwordChanged = true;
    await institution.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};
