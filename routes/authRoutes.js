const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login); 
router.get('/users', authController.getAllUsers);
router.get('/me', authController.getCurrentUser);

module.exports = router;( router)