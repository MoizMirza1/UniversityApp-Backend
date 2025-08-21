const Department = require("../models/Department");
const AppError = require("../utils/appError");

// Get all departments
exports.getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json({
      status: "success",
      results: departments.length,
      data: { departments }
    });
  } catch (err) {
    next(err);
  }
};

// Create department (admin only)
exports.createDepartment = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new AppError("Only admin can create departments", 403));
    }
    const department = await Department.create(req.body);
    res.status(201).json({ status: "success", data: { department } });
  } catch (err) {
    next(err);
  }
};

// Update department
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!department) {
      return next(new AppError("No department found with that ID", 404));
    }
    res.status(200).json({ status: "success", data: { department } });
  } catch (err) {
    next(err);
  }
};

// Delete department
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return next(new AppError("No department found with that ID", 404));
    }
    res.status(200).json({ status: "success", message: "Department deleted" });
  } catch (err) {
    next(err);
  }
};
