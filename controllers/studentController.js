const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Department = require('../models/Department')
const AppError = require('../utils/appError');

// Get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    // const students = await Student.find();
    const students = await Student.find().populate({
      path:  "department",
      select:   "name code"
    }
    );

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: { students }
    });
  } catch (err) {
    next(err);
  }
};

async function generateRollNumber(departmentId) {
  const department = await Department.findById(departmentId);
  if (!department) throw new AppError("Invalid department ID", 400);

  const year = new Date().getFullYear();
  const count = await Student.countDocuments({
    department: departmentId,
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`)
    }
  });

  const nextNumber = String(count + 1).padStart(3, "0");
  return `${department.code}-${year}-${nextNumber}`;
}

// ✅ Preview roll number (UX before creating)

    // GET API --   http://localhost:8000/api/preview-roll?departmentId=68a6390cc5131d50c189a4d0
    
exports.previewRollNumber = async (req, res, next) => {
  try {
    const { departmentId } = req.query;
    if (!departmentId) return next(new AppError("departmentId required", 400));
    const rollNumber = await generateRollNumber(departmentId);

    res.status(200).json({
      status: "success",
      data: { rollNumber }
    });
  } catch (error) {
    next(error);
  }
};
exports.createStudent = async (req, res, next) => {
  try {
    const { departmentId, ...studentData } = req.body;

    const department = await Department.findById(departmentId);
    if (!department) return next(new AppError("Invalid department ID", 400));

    // Generate roll number
    const rollNumber = await generateRollNumber(departmentId);

    
    const student = await Student.create({
      ...studentData,
      rollNumber,
      department: departmentId,
    });

   
    const user = await User.create({
      email: student.email,
      name: `${student.firstName} ${student.lastName}`,
      password: rollNumber, 
      role: "student",
      profileImage: student.image,
    });

    student.userId = user._id;
    await student.save();

    res.status(201).json({
      status: "success",
      message: "Student created successfully",
      data: { student, user }
    });
  } catch (error) {
    next(error);
  }
};


exports.getStudent = async (req, res, next) => {
  try {
     const student = await Student.findById(req.params.id).populate({
      path: "department",
      select: "name code"
    });

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


exports.deleteStudent = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

   
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }

    
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
    }

    
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Student and related User deleted successfully',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

