const Course = require('../models/Course');
const AppError = require('../utils/appError');
const { generateCourseCode } = require('../utils/courseCodeGenerator');

// controllers/courseController.js

// GET /api/courses?department=68a7099390ecabf884dab25c
// GET /api/courses?department=68a7099390ecabf884dab25c&level=2

exports.getAllCourses = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.department) {
      filter.department = req.query.department;
    }
    if (req.query.level) {
      filter.level = req.query.level;
    }

    const courses = await Course.find(filter)
      .populate("department", "name code")
      .populate("professor", "firstName lastName email")
      .populate("students", "name email role");

    res.status(200).json({
      status: "success",
      results: courses.length,
      data: { courses },
    });
  } catch (err) {
    next(err);
  }
};


// controllers/courseController.js

exports.createCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    const { title, department, level } = req.body;

    // 2. Check if course with same title + dept + level already exists
    const existing = await Course.findOne({ title, department, level });
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message:
          "Course with same title already exists in this department and level",
      });
    }

    // 3. Generate course code
    const courseCode = await generateCourseCode(department, level);

    // 4. Create course
    const course = await Course.create({
      ...req.body,
      courseCode,
    });

    res.status(201).json({ status: "success", data: course });
  } catch (err) {
    next(err);
  }
};


// GET http://localhost:8000/api/courses/preview?departmentId=<dep_id>&level=<level>
// http://localhost:8000/api/courses/preview?departmentId=68a7099390ecabf884dab25c&level=2
exports.previewCourseCode = async (req, res, next) => {
  try {
    const { departmentId, level } = req.query;
    if (!departmentId || !level) {
      return next(new AppError('Department and level are required for preview', 400));
    }

    const previewCode = await generateCourseCode(departmentId, level);
    res.status(200).json({
      status: 'success',
      data: { courseCode: previewCode }
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'students',
      select: 'name email role'
    });

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true 
      }
    );

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { course }
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('Course code already exists', 400));
    }
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {

    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return next(new AppError('No course found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Course deleted successfully',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.assignProfessorToCourse = async (req, res, next) => {
  try {
    const { courseId, teacherId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return next(new AppError("Course not found", 404));

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return next(new AppError("Teacher not found", 404));

    // assign professor
    course.professor = teacher._id;
    await course.save();

    // optionally also push to teacher.courses
    teacher.courses = teacher.courses || [];
    if (!teacher.courses.includes(course._id)) {
      teacher.courses.push(course._id);
      await teacher.save();
    }

    res.status(200).json({
      status: "success",
      message: "Course assigned to professor",
      data: { course },
    });
  } catch (err) {
    next(err);
  }
};


