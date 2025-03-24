const { Institution, Student } = require("../models/institution");
const upload = require("../middleware/multer");

// ✅ Institution Registers a Student
const registerStudent = async (req, res) => {
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
    await institution.save();

    res.status(201).json({
      message: "Student registered successfully",
    });
  } catch (error) {
    console.error("Student Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Upload Certificate
const uploadCertificate = async (req, res) => {
  try {
    const { birthCertificateNumber, level } = req.body;
    const institutionId = req.user.id; // Extract from authentication token

    // ✅ Find student by birth certificate number and institution
    const student = await Student.findOne({
      birthCertificateNumber,
      institution: institutionId,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found or not registered under your institution.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // ✅ Save the file path in the student's certificates
    student.certificates[level] = req.file.path;
    await student.save();

    res.status(200).json({
      message: "Certificate uploaded successfully",
      filePath: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Export both functions at once
module.exports = { registerStudent, uploadCertificate };
