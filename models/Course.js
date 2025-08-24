const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  courseCode: {
    type: String,
     unique: true,
    required: true,
  },
  level: {
    type: Number,
    required: [true, 'Please add a course level']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Department',required: true, index: true
  },

  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  professor: {
    type: String,
    required: true
  },
  maxStudents: {
    type: Number,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  students: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},
  { timestamps: true });


module.exports = mongoose.model('Course', CourseSchema);