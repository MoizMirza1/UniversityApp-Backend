// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student'); 

exports.protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verify token
   let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ status: 'fail', message: 'Token expired. Please log in again.' });
      } else {
        return res.status(401).json({ status: 'fail', message: 'Invalid token. Please log in.' });
      }
    }
    
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }
    
    req.user = currentUser;
   

    if (currentUser.role === 'student') {
      const student = await Student.findOne({ userId: currentUser._id })
        .populate('department', 'name code'); 
      if (!student) {
        return res.status(404).json({
          status: 'fail',
          message: 'Student record not found'
        });
      }
      req.student = student; 
    }

     next();
     } catch (err) {
    next(err);
    }  
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};