const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

// hiện tại / là đang ở thư mục views. --> muốn dẫn tới lecturer thì /login_actors/login_lecturer
router.get("/login_actors/login_lecturer", (req, res) => {
  res.render("login_actors/login_lecturer");
});

router.get("/login_actors/login_student", (req, res) => {
  res.render("login_actors/login_student");
});

router.get("/login_actors/login_staff", (req, res) => {
  res.render("login_actors/login_staff");
});

// ĐĂNG NHẬP THÀNH CÔNG ==> HIỆN GIAO DIỆN ỨNG VỚI TỪNG ACTORS.
//Giao diện của Student.
router.get("/student/student_UI", (req, res) => {
  res.render("student/student_UI");
});

//Giao diện của Lecturer.
router.get("/lecturer/lecturer_UI", (req, res) => {
  res.render("lecturer/lecturer_UI");
});

//Giao diện của Staff.
router.get("/staff/staff_UI", (req, res) => {
  res.render("staff/staff_UI");
});

//Giao diện của Staff- chức năng remove account.
router.get("/staff/staff_remove_account", (req, res) => {
  res.render("staff/staff_remove_account");
});

//Giao diện của Staff- chức năng remove  1 account --> option 1.
router.get("/staff/staff_remove_account_option1", (req, res) => {
  res.render("staff/staff_remove_account_option1");
});

//Giao diện của Staff- chức năng remove nhiều account thông qua .csv --> option 2.
router.get("/staff/staff_remove_account_option2", (req, res) => {
  res.render("staff/staff_remove_account_option2");
});

//Giao diện của Staff - tạo tài khoản bằng form
router.get("/staff/account_form", (req, res) => {
  res.render("staff/account_form");
});

//Giao diện của Staff -  tạo tài khoản bằng file
router.get("/staff/account_file", (req, res) => {
  res.render("staff/account_file");
});

//Giao diện của Staff - chức năng sửa đổi thông tin.
router.get("/staff/staff_change_profile", (req, res) => {
  res.render("staff/staff_change_profile");
});

// Giao diện của Student - view course
const courseController = require("../controllers/auth");
router.get("/student/view_course", courseController.view_course);

// Giao diện của Student - view grade
router.get("/student/view_grade", courseController.view_grade);

module.exports = router;
