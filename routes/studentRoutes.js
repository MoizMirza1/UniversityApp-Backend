const express = require("express");
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/students", studentController.getAllStudents);
router.get("/students/:id", studentController.getStudent);
router.get("/preview-roll", studentController.previewRollNumber);
router.get("/DepartmentByStudent", studentController.DepartmentByStudent);

// Admin-only routes
router.post("/students",  authMiddleware.protect,authMiddleware.restrictTo("admin"),  studentController.createStudent);
  
router.put( "/students/:id",  authMiddleware.protect,authMiddleware.restrictTo("admin"),studentController.updateStudent);
 
router.delete(  "/students/:id",authMiddleware.protect,  authMiddleware.restrictTo("admin"), studentController.deleteStudent);



                        // Student Dashboard APIS

router.get(  "/semester-courses",  authMiddleware.protect,studentController.getSemesterCourses);

module.exports = router;