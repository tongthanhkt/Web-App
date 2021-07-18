const express = require('express');
const url = require('url');
const dotenv = require('dotenv');;
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
router.get('/staff/staff_account_form', (req, res) => {
    res.render('staff/staff_account_form')
});

// Giao diện của Staff - tạo tài khoản bằng file
router.get('/staff/staff_account_file', (req, res) => {
    res.render('staff/staff_account_file')
});

// Giao diện của Staff - đổi mật khẩu
router.get('/staff/staff_change_password', (req, res) => {
    res.render('staff/staff_change_password')
});

// Giao diện của Staff - chức năng quản lý khóa học
router.get('/staff/staff_manage_course', (req, res) => {
    res.render('staff/staff_manage_course')
});

// Giao diện của Staff - chức năng xem danh sách khóa học
router.get('/staff/staff_view_courses', (req, res) => {
    var query = 'SELECT SubjectID, Semester, Year, Class ' +
        'FROM Course ' +
        'GROUP BY SubjectID, Semester, Year, Class ' +
        'ORDER BY Year DESC, Semester DESC, Class ASC, SubjectID ASC';
    database.query(query, function(error, results) {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            var temp = "";
            for (element in results) {
                temp += results[element]["SubjectID"] + "|" + results[element]["Class"] + "|" + results[element]["Year"] + "|" + results[element]["Semester"] + " ";
            }
            res.render('staff/staff_view_courses', { data: temp });
        }
    })
});

// Giao diện của Staff - chức năng xem chi tiết khóa học
router.get('/staff/staff_course_detail', (req, res) => {
    var url_parts = url.parse(req.url, true);
    var data = url_parts.query;
    var query = 'SELECT LecturerID, StudentID, Midterm, Final, Total ' +
        'FROM Course ' +
        `WHERE SubjectID = "${data["SubjectID"]}" and Class = "${data["Class"]}" and Year = ${data["Year"]} and Semester = ${data["Semester"]} ` +
        'ORDER BY LecturerID, StudentID';
    database.query(query, function(error, results) {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            var temp = "";
            for (element in results) {
                temp += results[element]["LecturerID"] + "|" + results[element]["StudentID"] + "|" + results[element]["Midterm"] + "|" + results[element]["Final"] + "|" + results[element]["Total"] + " ";
            }
            res.render('staff/staff_course_detail', { data: temp });
        }
    })
})

module.exports = router;