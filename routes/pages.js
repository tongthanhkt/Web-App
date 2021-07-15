const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

//MYSQl
//MYSQL
const mysql = require('mysql');
const database = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT,
    multipleStatements: true
});

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

//Giao diện của Staff.
router.get('/staff/staff_UI', (req, res) => {
    res.render('staff/staff_UI');
});


//Giao diện của Staff- chức năng remove account.
router.get('/staff/staff_remove_account', (req, res) => {
    res.render('staff/staff_remove_account');
});

//Giao diện của Staff- chức năng remove  1 account --> option 1.
router.get('/staff/staff_remove_account_option1', (req, res) => {
    res.render('staff/staff_remove_account_option1');
});


//Giao diện của Staff- chức năng remove nhiều account thông qua .csv --> option 2.
router.get('/staff/staff_remove_account_option2', (req, res) => {
    res.render('staff/staff_remove_account_option2');
});


//Giao diện của Staff - tạo tài khoản bằng form
router.get('/staff/account_form', (req, res) => {
    res.render('staff/account_form')
});

//Giao diện của Staff -  tạo tài khoản bằng file
router.get('/staff/account_file', (req, res) => {
    res.render('staff/account_file')
});

//Giao diện của Staff - chức năng sửa đổi thông tin cá nhân.
router.get('/staff/staff_change_profile', (req, res) => {
    res.render('staff/staff_change_profile')
});

//Giao diện của Staff - chức năng xem thông tin cá nhân.
router.get('/staff/staff_view_profile', (req, res) => {
    var id = localStorage.getItem("ID");
    console.log(id);
    database.query('SELECT * from Staff where StaffID = ?', id, function(error, results) {
        if (error) {
            console.log("error ocurred while getting user details of " + id, error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log(results);
            let profile = "";
            for (let key in results[0]) {
                console.log(results[0][key]);
                profile = profile+ results[0][key] + "!";
            }
            res.render("staff/staff_view_profile",{user:profile});
        }
    });
});

module.exports = router;