const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please add last name"],
  },
  rollNumber: {
    type: String,
    unique: true,
    required: [true, "Please add roll number"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add email"],
  },
  admissionDate: {
    type: Date,
    required: [true, "Please add admission date"],
  },
  regDate: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: String,
    enum: ["Computer Science", "Software", "AI", "Cyber Security"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  parentNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "no-photo.jpg",
  },
  status: { type: String,
    enum: ["active", "graduated", "suspended"], default: "active" }
},
    { timestamps: true });

module.exports = mongoose.model("Student", StudentSchema);
