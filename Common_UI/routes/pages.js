const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

// hiện tại / là đang ở thư mục views. --> muốn dẫn tới lecturer thì /login_actors/login_lecturer
router.get('/login_actors/login_lecturer', (req, res) => {
    res.render('login_actors/login_lecturer');
});

router.get('/login_actors/login_student', (req, res) => {
    res.render('login_actors/login_student');
});

router.get('/login_actors/login_staff', (req, res) => {
    res.render('login_actors/login_staff');
});


//Giao diện của student.
router.get('/student/student_UI', (req, res) => {
    res.render('student/student_UI');
});


//Giao diện của lecturer.
router.get('/staff/staff_UI', (req, res) => {
    res.render('staff/staff_UI');
});

module.exports = router;