const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const AppError = require('../utils/appError');

// Get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: { students }
    });
  } catch (err) {
    // next(err);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const studentData = req.body;

    // 1. Create Student record
    const student = await Student.create(studentData);

    // 2. Hash default password (student rollNumber)
    const hashedPassword = await bcrypt.hash(student.rollNumber, 12);

    // 3. Create User record for login
    await User.create({
      email: student.email,
      name: `${student.firstName} ${student.lastName}`,
      password: student.rollNumber,
      role: "student",
    });

    res.status(201).json({
      status: "success",
      message: "Student and User created successfully",
      data: { student }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};


// Get single student
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { student }
    });
  } catch (err) {
    next(err);
  }
};

// Update student
exports.updateStudent = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { student }
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('Email already exists', 400));
    }
    next(err);
  }
};

// Delete student
exports.deleteStudent = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Student deleted successfully',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
