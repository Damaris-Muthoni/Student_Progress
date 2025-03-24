const { Institution, Student } = require("../models/institution");

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get students by school
exports.getStudentsBySchool = async (req, res) => {
  try {
    const students = await Student.find({ schoolId: req.params.schoolId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a student
exports.addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: "$county",
          totalSchools: { $addToSet: "$schoolId" }, // Collect unique schoolIds
          totalStudents: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          totalSchools: { $size: "$totalSchools" }, // Count unique schools
          totalStudents: 1,
        },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
