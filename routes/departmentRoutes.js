const express = require("express");
const departmentController = require("../controllers/departmentController")
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/departments", departmentController.getAllDepartments);
// router.get("/departments/:id", departmentController.getDepartment);

// Admin-only routes
router.post("/departments", authMiddleware.protect,  authMiddleware.restrictTo("admin"),departmentController.createDepartment);
  
router.put("/departments/:id",authMiddleware.protect, authMiddleware.restrictTo("admin"),  departmentController.updateDepartment);
  
router.delete(  "/departments/:id",  authMiddleware.protect,  authMiddleware.restrictTo("admin"),departmentController.deleteDepartment);

module.exports = router;