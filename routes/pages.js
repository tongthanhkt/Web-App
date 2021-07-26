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


// ĐĂNG NHẬP THÀNH CÔNG ==> HIỆN GIAO DIỆN ỨNG VỚI TỪNG ACTORS.
//Giao diện của Student.
router.get('/student/student_UI', (req, res) => {
    res.render('student/student_UI');
});


//Giao diện của Lecturer.
router.get('/lecturer/lecturer_UI', (req, res) => {
    res.render('lecturer/lecturer_UI');
});

// Giao diện của ClassCourse khi Lecturer nhấn vào button view Class and Course
router.get('/lecturer/ClassCourse',(req,res)=>{
    res.render('lecturer/ClassCourse')
});



//Giao diện của Staff.
router.get('/staff/staff_UI', (req, res) => {
    res.render('staff/staff_UI');
});


module.exports = router;