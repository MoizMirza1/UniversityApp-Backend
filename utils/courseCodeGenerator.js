// utils/courseCodeGenerator.js
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Department = require('../models/Department');

exports.generateCourseCode = async (departmentId, level) => {
  // 1) Get department short code (e.g., "CS")
  const department = await Department.findById(departmentId);
  if (!department) throw new Error('Department not found');
  const depCode = department.code;

  // 2) Count how many courses already exist for THIS dept + level
  const count = await Course.countDocuments({
    department: new mongoose.Types.ObjectId(departmentId),
    level: Number(level)
  });

  // 3) Next serial = count + 1  (001, 002, 003 ...)
  const nextSerial = count + 1;

  // 4) Format
  const levelStr = String(level).padStart(2, '0');
  const serialStr = String(nextSerial).padStart(3, '0');

  return `${depCode}-${levelStr}-${serialStr}`;
};
