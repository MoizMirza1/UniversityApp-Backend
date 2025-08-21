// models/Department.js
const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add department name"],
    unique: true,
    trim: true,
    maxlength: 50
  },
  code: {
    type: String,
    required: [true, "Please add department code"],
    unique: true,
    uppercase: true,
    maxlength: 10
  },
  headOfDepartment: {
    type: String,
    required: [true, "Please add Head of Department name"],
    trim: true,
    maxlength: 50
  },
  maxStudents: {
    type: Number,
    default: 100,
    max: 1000
  },
  departmentDetails: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { timestamps: true });

module.exports = mongoose.model("Department", DepartmentSchema);
