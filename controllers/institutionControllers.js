const bcrypt = require("bcryptjs");
const { Institution } = require("../models/institution");

// Register an Institution
exports.registerInstitution = async (req, res) => {
  try {
    const { name, email, phone, county, address, schoolId } = req.body;

    // ✅ Check for missing fields
    if (!name || !email || !phone || !county || !address || !schoolId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Trim and normalize email
    const trimmedEmail = email.trim().toLowerCase();

    // ✅ Check if institution with same email or schoolId exists
    const existingInstitution = await Institution.findOne({
      $or: [{ email: trimmedEmail }, { schoolId }],
    });

    if (existingInstitution) {
      return res.status(400).json({
        message: "Institution already registered with this email or school ID",
      });
    }

    // ✅ Default password = schoolId (but hashed)
    const hashedPassword = await bcrypt.hash(schoolId, 10);

    // ✅ Create new institution
    const newInstitution = new Institution({
      name,
      email: trimmedEmail,
      phone,
      county,
      address,
      schoolId,
      password: hashedPassword,
      passwordChanged: false, // Must change password on first login
    });

    await newInstitution.save();
    res.status(201).json({ message: "Institution registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch School Details
exports.getSchoolDetails = async (req, res) => {
  try {
    const school = await Institution.findOne({ schoolId: req.user.schoolId });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json({
      name: school.name,
      county: school.county,
      schoolId: school.schoolId,
    });
  } catch (error) {
    console.error("Error fetching school details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
