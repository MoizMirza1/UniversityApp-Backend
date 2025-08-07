const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();

// In your Express backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000/api',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
require('./config/db');


app.get("/" , (req, res) =>{
  res.send("Welcome to University App")
})
app.use('/api', require('./routes/authRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/faculty', require('./routes/facultyRoutes'));

// Error handling middleware
app.use(require('./utils/errorHandler'));


module.exports = app;