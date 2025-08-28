const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course')
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
  let attempt = 1;
  
  while (attempt <= 999) { // Prevent infinite loop
    const nextNumber = String(attempt).padStart(3, "0");
    const rollNumber = `${department.code}-${year}-${nextNumber}`;
    
    // Check if this roll number already exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (!existingStudent) {
      console.log('Department:', department);
      console.log('Generated roll number:', rollNumber);
      
      return rollNumber;
    }
    
    attempt++;
  }
  
  throw new AppError("Unable to generate unique roll number", 500);
}

// ✅ Preview roll number (UX before creating)
// GET API --   http://localhost:8000/api/preview-roll?departmentId=68a6390cc5131d50c189a4d0


    
exports.previewRollNumber = async (req, res, next) => {
  try {
    const { departmentId } = req.query;
    if (!departmentId) return next(new AppError("departmentId required", 400));
    
    console.log('Department ID received:', departmentId);
    const rollNumber = await generateRollNumber(departmentId);

    res.status(200).json({
      status: "success",
      data: { rollNumber }
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Check roll number conflicts (for debugging)
// GET API --   http://localhost:8000/api/DepartmentByStudent?departmentId=68ab62d081ac98aceac32161

exports.DepartmentByStudent = async (req, res, next) => {
  try {
    const { departmentId } = req.query;
    if (!departmentId) return next(new AppError("departmentId required", 400));
    
    const department = await Department.findById(departmentId);
    if (!department) return next(new AppError("Invalid department ID", 400));
    
    const year = new Date().getFullYear();
    const rollNumberPattern = new RegExp(`^${department.code}-${year}-\\d{3}$`);
    
    // Find all students with this roll number pattern
    const studentsWithPattern = await Student.find({
      rollNumber: rollNumberPattern
    }).populate('department', 'name code');
    
    // Find students currently in this department
    const studentsInDepartment = await Student.find({
      department: departmentId
    }).populate('department', 'name code');
    
    res.status(200).json({
      status: "success",
      data: {
        department: { name: department.name, code: department.code },
        year,
        rollNumberPattern: rollNumberPattern.toString(),
        studentsWithPattern: studentsWithPattern.map(s => ({
          id: s._id,
          name: `${s.firstName} ${s.lastName}`,
          rollNumber: s.rollNumber,
          currentDepartment: s.department
        })),
        studentsInDepartment: studentsInDepartment.map(s => ({
          id: s._id,
          name: `${s.firstName} ${s.lastName}`,
          rollNumber: s.rollNumber,
          currentDepartment: s.department
        })),
        countWithPattern: studentsWithPattern.length,
        countInDepartment: studentsInDepartment.length
      }
    });
  } catch (error) {
    next(error);
  }
};
// ✅ Create Student + User
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

    const { departmentId, ...updateData } = req.body;
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return next(new AppError('No student found with that ID', 404));
    }
    
    // If department is changing, regenerate roll number
    if (departmentId && departmentId !== student.department.toString()) {
      console.log('Department is changing, regenerating roll number...');
      const newRollNumber = await generateRollNumber(departmentId);
      updateData.rollNumber = newRollNumber;
      updateData.department = departmentId;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate({
      path: "department",
      select: "name code"
    });

    res.status(200).json({
      status: 'success',
      data: { student: updatedStudent }
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


                      //  For Student Dashboard Apis


exports.getSemesterCourses = async (req, res, next) => {
  try {
    const student = req.student; // already set by authMiddleware

    if (!student) {
      return next(new AppError("Student not found", 404));
    }

    // Fetch courses based on department + current semester
    const courses = await Course.find({
      department: student.department, 
      level: student.currentSemester
    });

    console.log(courses)

    res.status(200).json({
      status: "success",
      results: courses.length,
      data: { courses }
    });
  } catch (err) {
      next(err)
  }
};

