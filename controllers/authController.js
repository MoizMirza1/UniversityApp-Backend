// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    console.log("Incoming login request");
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Missing credentials");
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    console.log("User found:", user?.email);
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      }
    
    );
      
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

// Add this to your existing authController
exports.getAllUsers = async (req, res, next) => {
  try {
    // 1) Get all users (excluding sensitive data)
    const users = await User.find().select('-password -__v');

    // 2) Send response
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
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
   const decoded = await jwt.verify(token, process.env.JWT_SECRET);



    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Return user data
    res.status(200).json({
      status: 'success',
      data: {
        user: currentUser
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Token valid',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (err) {
    next(err);
  }
};