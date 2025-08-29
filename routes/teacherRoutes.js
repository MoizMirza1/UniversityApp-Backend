const express = require("express");
const teacherController = require("../controllers/teacherController")

const router = express.Router();


router.post("/teachers", teacherController.createTeacher);
router.get("/teachers", teacherController.getAllTeachers);
router.get("/teachers/:id", teacherController.getTeacherById);
router.put("/teachers/:id", teacherController.updateTeacher);
router.delete("/teachers/:id", teacherController.deleteTeacher);

module.exports = router;
