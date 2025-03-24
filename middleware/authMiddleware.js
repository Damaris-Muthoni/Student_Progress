const jwt = require("jsonwebtoken");
const { Institution } = require("../models/institution");

exports.validateAuthToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer Token

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode Token
    req.user = decoded; // Attach user data to request

    // Ensure institution exists
    const institution = await Institution.findOne({
      schoolId: decoded.schoolId,
    });
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
