const mongoose = require("mongoose");

// Institution Schema
const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  county: { type: String, required: true },
  address: { type: String, required: true },
  schoolId: { type: String, unique: true, required: true }, // Default login username
  password: { type: String, required: true }, // Default is schoolId, must be changed later
  createdAt: { type: Date, default: Date.now },
  passwordChanged: { type: Boolean, default: false }, // To track if the password has been changed
  token: { token: String, createdAt: { type: Date, default: Date.now } },
});

const Institution = mongoose.model("Institution", institutionSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  birthCertificateNumber: { type: String, unique: true, required: true },
  county: { type: String, required: true },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
  },
  currentLevelOfStudy: { type: String, required: true },
  certificates: {
    prePrimary: { type: String, default: null }, // 2 years (Pre-primary)
    primary: { type: String, default: null }, // 6 years (Primary)
    secondary: { type: String, default: null }, // 6 years (Secondary)
    university: { type: String, default: null }, // 3 years (University)
  },
  enrollmentDate: { type: Date, default: Date.now },
  dropout: { type: Boolean, default: false },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = { Student, Institution };
