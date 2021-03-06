const express = require("express");
const dotenv = require("dotenv");
const url = require("url");
dotenv.config({ path: "./.env" });

//MYSQl
const mysql = require("mysql");
const database = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
  multipleStatements: true,
});

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
router.get("/student/student_view_profile", (req, res) => {
  var id = localStorage.getItem("ID");
  console.log(id);
  database.query(
    "SELECT * from Student where StudentID = ?",
    id,
    function (error, results) {
      if (error) {
        console.log("error ocurred while getting user details of " + id, error);
        res.send({
          code: 400,
          failed: "error ocurred",
        });
      } else {
        console.log(results);
        let profile = "";
        for (let key in results[0]) {
          if (key != "Password") {
            console.log(results[0][key]);
            profile = profile + results[0][key] + "!";
          }
        }
        res.render("student/student_view_profile", { user: profile });
      }
    }
  );
});
router.get("/student/student_change_password", (req, res) => {
  res.render("student/student_change_password");
});

router.get("/student/student_change_profile", (req, res) => {
  res.render("student/student_change_profile");
});
const courseController = require("../controllers/auth");
router.get("/student/view_course", courseController.view_course);
router.get("/student/view_grade", courseController.view_grade);
router.post("/", courseController.find);
//Giao diện của Lecturer.
router.get("/lecturer/lecturer_UI", (req, res) => {
  res.render("lecturer/lecturer_UI");
});

//Giao diện của Staff.
router.get("/staff/staff_UI", (req, res) => {
  res.render("staff/staff_UI");
});

//Giao diện của Staff- chức năng remove account.
router.get("/staff/staff_manage_accounts", (req, res) => {
  res.render("staff/staff_manage_accounts");
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
router.get("/staff/staff_account_form", (req, res) => {
  res.render("staff/staff_account_form");
});

//Giao diện của Staff -  tạo tài khoản bằng file
router.get("/staff/staff_account_file", (req, res) => {
  res.render("staff/staff_account_file");
});

//Giao diện của Staff - chức năng sửa đổi thông tin cá nhân.
router.get("/staff/staff_change_profile", (req, res) => {
  res.render("staff/staff_change_profile");
});

//Giao diện của Staff - chức năng xem thông tin cá nhân.
router.get("/staff/staff_view_profile", (req, res) => {
  var id = localStorage.getItem("ID");
  console.log(id);
  database.query(
    "SELECT * from Staff where StaffID = ?",
    id,
    function (error, results) {
      if (error) {
        console.log("error ocurred while getting user details of " + id, error);
        res.send({
          code: 400,
          failed: "error ocurred",
        });
      } else {
        console.log(results);
        let profile = "";
        for (let key in results[0]) {
          if (key != "Password") {
            console.log(results[0][key]);
            profile = profile + results[0][key] + "!";
          }
        }
        res.render("staff/staff_view_profile", { user: profile });
      }
    }
  );
});

// Giao diện đổi mật khẩu
router.get("/staff/staff_change_password", (req, res) => {
  res.render("staff/staff_change_password");
});

// Giao diện của Staff - chức năng quản lý khóa học
router.get("/staff/staff_manage_course", (req, res) => {
  res.render("staff/staff_manage_course");
});

// Giao diện của Staff - chức năng xem danh sách khóa học
router.get("/staff/staff_view_courses", (req, res) => {
  var url_parts = url.parse(req.url, true);
  var data = url_parts.query;
  var query = "";
  if (data !== undefined) {
    query = `DELETE FROM Course WHERE SubjectID = "${data["SubjectID"]}" and Class = "${data["Class"]}" and Year = ${data["Year"]} and Semester = ${data["Semester"]}`;
    database.query(query);
  }
  query =
    "SELECT SubjectID, Semester, Year, Class " +
    "FROM Course " +
    "GROUP BY SubjectID, Semester, Year, Class " +
    "ORDER BY Year DESC, Semester DESC, Class ASC, SubjectID ASC";
  database.query(query, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      var temp = "";
      for (element in results) {
        temp +=
          results[element]["SubjectID"] +
          "|" +
          results[element]["Class"] +
          "|" +
          results[element]["Year"] +
          "|" +
          results[element]["Semester"] +
          " ";
      }
      res.render("staff/staff_view_courses", { data: temp });
    }
  });
});

// Giao diện của Staff - chức năng xem chi tiết khóa học
router.get("/staff/staff_course_detail", (req, res) => {
  var url_parts = url.parse(req.url, true);
  var data = url_parts.query;
  var query = "";
  if (data["ID"] !== undefined) {
    query = `DELETE FROM Course WHERE SubjectID = "${data["SubjectID"]}" and Class = "${data["Class"]}" and Year = ${data["Year"]} and Semester = ${data["Semester"]} and StudentID = ${data["ID"]}`;
    database.query(query);
  }
  query =
    "SELECT LecturerID, StudentID, Midterm, Final, Total " +
    "FROM Course " +
    `WHERE SubjectID = "${data["SubjectID"]}" and Class = "${data["Class"]}" and Year = ${data["Year"]} and Semester = ${data["Semester"]} ` +
    "ORDER BY LecturerID, StudentID";
  database.query(query, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      var temp = "";
      for (element in results) {
        temp +=
          results[element]["LecturerID"] +
          "|" +
          results[element]["StudentID"] +
          "|" +
          results[element]["Midterm"] +
          "|" +
          results[element]["Final"] +
          "|" +
          results[element]["Total"] +
          " ";
      }
      res.render("staff/staff_course_detail", { data: temp });
    }
  });
});

// Giao diện tìm kiếm thông tin account -Search accounts
router.get("/staff/staff_search_accounts", (req, res) => {
  query = "SELECT distinct Faculty FROM Lecturer";
  database.query(query, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      var temp = "";
      for (element in results) {
        temp += results[element]["Faculty"] + "||";
      }
      res.render("staff/staff_search_accounts", { data: temp });
    }
  });
});

// Giao diện tìm kiếm thông tin account -Search accounts fill up
router.get("/staff/staff_search_accounts_fillup", (req, res) => {
  res.render("staff/staff_search_accounts_fillup");
});

// Giao diện của Staff - chức năng xem danh sách khóa học
router.get("/staff/staff_search_results", (req, res) => {
  let id = localStorage.getItem("ID_Search");
  let fname = localStorage.getItem("FName_Search");
  let lname = localStorage.getItem("LName_Search");
  let phone = localStorage.getItem("Phone_Search");
  let year = localStorage.getItem("Year_Search");
  let dob = localStorage.getItem("DoB_Search");
  let faculty = localStorage.getItem("Faculty_Search");
  let actor = localStorage.getItem("Actor_Search");

  if (
    !id &&
    !fname &&
    !lname &&
    !phone &&
    !year &&
    !dob &&
    faculty != "Choose Falcuty" &&
    actor == "Student"
  ) {
    database.query(
      "SELECT * from Student where Student.Faculty = ?",
      [faculty],
      function (error, results) {
        if (error) {
          console.log(
            "error ocurred while getting user details of " + id,
            error
          );
          res.send({
            code: 400,
            failed: "error ocurred",
          });
        } else {
          var temp = "";
          for (element in results) {
            temp +=
              results[element]["StudentID"] +
              "||" +
              results[element]["Fullname"] +
              "||" +
              results[element]["PhoneNumber"] +
              "||" +
              results[element]["StartYear"] +
              "||" +
              results[element]["DateOfBirth"] +
              "||" +
              results[element]["Faculty"] +
              "  ";
          }
          res.render("staff/staff_search_results", { data: temp });
        }
      }
    );
  }
  if (
    !id &&
    !fname &&
    !lname &&
    !phone &&
    !year &&
    !dob &&
    faculty != "Choose Falcuty" &&
    actor == "Lecturer"
  ) {
    database.query(
      "SELECT * from Lecturer where Lecturer.Faculty = ?",
      [faculty],
      function (error, results) {
        if (error) {
          console.log(
            "error ocurred while getting user details of " + id,
            error
          );
          res.send({
            code: 400,
            failed: "error ocurred",
          });
        } else {
          var temp = "";
          for (element in results) {
            temp +=
              results[element]["LecturerID"] +
              "||" +
              results[element]["Fullname"] +
              "||" +
              results[element]["PhoneNumber"] +
              "||" +
              results[element]["StartYear"] +
              "||" +
              results[element]["DateOfBirth"] +
              "||" +
              results[element]["Faculty"] +
              "  ";
          }
          res.render("staff/staff_search_results", { data: temp });
        }
      }
    );
  } else {
    if (actor == "Lecturer") {
      fname = "%" + fname + "%";
      lname = "%" + lname;
      database.query(
        "SELECT * from Lecturer where LecturerID = ? OR PhoneNumber = ? OR Fullname LIKE ? OR Fullname LIKE ? OR StartYear = ? OR Faculty = ?",
        [id, phone, fname, lname, year, faculty],
        function (error, results) {
          if (error) {
            console.log(
              "error ocurred while getting user details of " + id,
              error
            );
            res.send({
              code: 400,
              failed: "error ocurred",
            });
          } else {
            var temp = "";
            for (element in results) {
              temp +=
                results[element]["LecturerID"] +
                "||" +
                results[element]["Fullname"] +
                "||" +
                results[element]["PhoneNumber"] +
                "||" +
                results[element]["StartYear"] +
                "||" +
                results[element]["DateOfBirth"] +
                "||" +
                results[element]["Faculty"] +
                "  ";
            }
            res.render("staff/staff_search_results", { data: temp });
          }
        }
      );
    } else if (actor == "Student") {
      fname = "%" + fname + "%";
      lname = "%" + lname;
      database.query(
        "SELECT * from Student where StudentID = ? OR PhoneNumber = ? OR Fullname LIKE ? OR Fullname LIKE ? OR StartYear = ? OR Faculty = ?",
        [id, phone, fname, lname, year, faculty],
        function (error, results) {
          if (error) {
            console.log(
              "error ocurred while getting user details of " + id,
              error
            );
            res.send({
              code: 400,
              failed: "error ocurred",
            });
          } else {
            var temp = "";
            for (element in results) {
              temp +=
                results[element]["StudentID"] +
                "||" +
                results[element]["Fullname"] +
                "||" +
                results[element]["PhoneNumber"] +
                "||" +
                results[element]["StartYear"] +
                "||" +
                results[element]["DateOfBirth"] +
                "||" +
                results[element]["Faculty"] +
                "  ";
            }
            res.render("staff/staff_search_results", { data: temp });
          }
        }
      );
    }
  }
});

// Giao diện tìm kiếm thông tin account -Search accounts
router.get("/staff/staff_create_course", (req, res) => {
  query =
    "SELECT Faculty, LecturerID, Fullname, SubjectID, Name FROM Lecturer, Subject";
  database.query(query, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      var temp = "";
      var sub = "";
      console.log(results);
      for (element in results) {
        temp += results[element]["Faculty"] + "||";
        temp += results[element]["LecturerID"] + "||";
        temp += results[element]["Fullname"] + "||";
        sub += results[element]["SubjectID"] + "||";
        sub += results[element]["Name"] + "||";
      }
      temp = temp + "--" + sub;
      res.render("staff/staff_create_course", { data: temp });
    }
  });
});

//Giao diện của Staff- chức năng remove nhiều account thông qua .csv --> option 2.
router.get("/staff/staff_create_course_file", (req, res) => {
  res.render("staff/staff_create_course_file");
});

module.exports = router;
