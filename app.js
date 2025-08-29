const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();

// In your Express backend

app.use(cors({
  origin: process.env.ORIGIN_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE',], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
require('./config/db');


app.get("/" , (req, res) =>{
  res.json("Welcome to University App")
})


app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/courseRoutes'));
app.use('/api', require('./routes/studentRoutes'));
app.use("/api", require("./routes/departmentRoutes.js"));
app.use("/api", require("./routes/teacherRoutes.js"));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/faculty', require('./routes/facultyRoutes'));
// Error handling middleware
app.use(require('./utils/errorHandler'));
// app.use(require("./utils/appError.js"))


module.exports = app;