const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/login', authController.login); 
router.get('/users', authController.getAllUsers);
router.get('/me', authController.getCurrentUser);
router.get('/verify', authMiddleware.protect, authController.verifyToken);

module.exports = router;( router)