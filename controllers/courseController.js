const Course = require('../models/Course');
const AppError = require('../utils/appError');

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate({
      path: 'students',
      select: 'name email role'
    });

    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    // Only admin can create courses
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    // // Handle file upload if image exists
    // if (req.file) {
    //   req.body.image = req.file.filename;
    // }

    const course = await Course.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        course
      }
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
