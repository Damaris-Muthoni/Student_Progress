const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Institution } = require("../models/institution");

const SECRET_KEY = process.env.JWT_SECRET;

const isTokenExpired = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return false; // Token is still valid
  } catch (err) {
    return true; // Token is expired
  }
};

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

    let token = institution.token?.token || null;

    // ✅ If there's an existing token, check if it's valid
    if (token && !isTokenExpired(token)) {
      return res.status(200).json({ message: "Login successful", token });
    }

    // ✅ Generate a new token if no valid token exists
    token = jwt.sign(
      { id: institution._id, schoolId: institution.schoolId },
      SECRET_KEY,
      { expiresIn: "20h" } // Token valid for 20 hours
    );

    // ✅ Update the single token in the database
    institution.token = { token, createdAt: new Date() };
    await institution.save();

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Change Password (First-time Login)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const institutionId = req.user.schoolId;
    const institution = await Institution.findOne({ institutionId });

    if (!institution) {
      console.log("Institution not found");
      return res.status(404).json({ message: "Institution not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, institution.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    institution.password = hashedPassword;
    institution.passwordChanged = true;
    await institution.save();

    res.status(201).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
};

exports.validateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    }

    req.user = decoded; // Attach user data to request object
    next(); // Proceed to next middleware or controller
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
