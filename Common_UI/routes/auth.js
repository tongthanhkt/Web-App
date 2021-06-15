const express = require('express');

const authController = require('../controllers/auth');
const router = express.Router();

router.post('/login', authController.login);

router.post('/login_actors/login_student', authController.login_student);
router.post('/login_actors/login_lecturer', authController.login_lecturer);
router.post('/login_actors/login_staff', authController.login_staff);

router.post('/staff/staff_UI', authController.staff_UI);

module.exports = router;