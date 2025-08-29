const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TeacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please add first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please add last name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add email"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please add password"],
    minlength: 6,
    select: false, // don’t return password in queries
  },
  designation: {
    type: String,
    required: [true, "Please add designation"], 
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
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
  dob: {
    type: Date,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: [true, "Please add joining date"],
  },
  image: {
    type: String,
    default: "no-photo.jpg",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

// 🔒 Hash password before save
TeacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("Teacher", TeacherSchema);
