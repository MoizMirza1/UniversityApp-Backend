// routes/courseRoutes.js
const express = require("express");
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourse);

// Admin-only routes
router.post("/", authMiddleware.protect,  authMiddleware.restrictTo("admin"),  courseController.createCourse );

module.exports = router;
