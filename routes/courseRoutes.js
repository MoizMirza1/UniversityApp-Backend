// routes/courseRoutes.js
const express = require("express");
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/courses", courseController.getAllCourses);
router.get("/courses/:id", courseController.getCourse);

// Admin-only routes
router.post("/courses", authMiddleware.protect,  authMiddleware.restrictTo("admin"),  courseController.createCourse );


module.exports = router;
