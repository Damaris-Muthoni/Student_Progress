const { Institution, Student } = require("../models/institution");

// ✅ Institution Registers a Student
exports.registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dob,
      birthCertificateNumber,
      currentLevelOfStudy,
      county,
    } = req.body;

    // ✅ Extract institution ID from the authenticated user's token
    const institutionId = req.user.schoolId;

    // ✅ Ensure institution exists
    const institution = await Institution.findOne({ schoolId: institutionId });
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    // ✅ Prevent duplicate students by birth certificate number
    const existingStudent = await Student.findOne({ birthCertificateNumber });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // ✅ Create new student
    const newStudent = new Student({
      name,
      email,
      phone,
      dob,
      birthCertificateNumber,
      currentLevelOfStudy,
      county,
      institution: institution._id, // Link student to institution
    });

    // ✅ Save student & update institution records
    await newStudent.save();
    institution.students.push(newStudent._id);
    await institution.save();

    res.status(201).json({
      message: "Student registered successfully",
    });
  } catch (error) {
    console.error("Student Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// uploadControls.js
const Student = require("../models/student");
const upload = require("../middleware/multer");

exports.uploadCertificate = async (req, res) => {
  try {
    const { studentId, level } = req.body;
    const institutionId = req.user.id; // Extract from authentication token

    const student = await Student.findOne({ _id: studentId, institution: institutionId });
    if (!student) {
      return res.status(404).json({ message: "Student not found or not registered under your institution." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    student.certificates[level] = req.file.path;
    await student.save();

    res.status(200).json({ message: "Certificate uploaded successfully", filePath: req.file.path });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};