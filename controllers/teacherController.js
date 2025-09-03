const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const Department = require("../models/Department");
const User = require("../models/User");
const AppError = require("../utils/appError");

// Get all teachers
exports.getAllTeachers = async (req, res, next) => {
  try { const filter = {};
   if (req.query.department) { filter.department = req.query.department; }
    const teachers = await Teacher.find(filter).populate("department", "name code");
     res.status(200).json({ status: "success", results: teachers.length, data: { teachers },
     }
    );
   }
     catch (err) 
     { next(err);} };

// Get single teacher
exports.getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("department", "name code");
    if (!teacher) return next(new AppError("No teacher found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: { teacher },
    });
  } catch (err) {
    next(err);
  }
};

// Create teacher (admin only)
exports.createTeacher = async (req, res, next) => {
  try {
    const { password, confirmPassword, ...teacherData } = req.body;

    if (password !== confirmPassword) {
      return next(new AppError("Passwords do not match", 400));
    }

    const department = await Department.findById(teacherData.department);
    if (!department) return next(new AppError("Invalid department ID", 400));

    const teacher = await Teacher.create({ ...teacherData, password });

    // Create linked user
    const user = await User.create({
      email: teacher.email,
      name: `${teacher.firstName} ${teacher.lastName}`,
      password: password,
      role: "teacher", 
      profileImage: teacher.image,
    });

    teacher.userId = user._id;
    await teacher.save();

    res.status(201).json({
      status: "success",
      data: { teacher, user },
    });
  } catch (err) {
    next(err);
  }
};

// Update teacher
exports.updateTeacher = async (req, res, next) => {
  try {
    const { password, confirmPassword, ...updateData } = req.body;

    if (password && password !== confirmPassword) {
      return next(new AppError("Passwords do not match", 400));
    }

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return next(new AppError("No teacher found with that ID", 404));

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("department", "name code");

    res.status(200).json({
      status: "success",
      data: { teacher: updatedTeacher },
    });
  } catch (err) {
    next(err);
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return next(new AppError("No teacher found with that ID", 404));

    if (teacher.userId) {
      await User.findByIdAndDelete(teacher.userId);
    }

    await Teacher.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Teacher and related User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
