const express = require('express');
const dotenv = require('dotenv');
const url = require('url');
dotenv.config({ path: './.env' });

//MYSQl
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
router.get('/staff/staff_manage_accounts', (req, res) => {
    res.render('staff/staff_manage_accounts');
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

//Giao diện của Staff -  tạo tài khoản bằng file
router.get('/staff/staff_account_file', (req, res) => {
    res.render('staff/staff_account_file')
});

//Giao diện của Staff - chức năng sửa đổi thông tin cá nhân.
router.get('/staff/staff_change_profile', (req, res) => {
    res.render('staff/staff_change_profile')
});

//Giao diện của Staff - chức năng xem thông tin cá nhân.
router.get('/staff/staff_view_profile', (req, res) => {
    var id = localStorage.getItem("ID");
    console.log(id);
    database.query('SELECT * from Staff where StaffID = ?', id, function (error, results) {
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
                profile = profile + results[0][key] + "!";
            }
            res.render("staff/staff_view_profile", { user: profile });
        }
    });
});


// Giao diện đổi mật khẩu
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
    database.query(query, function (error, results) {
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
    database.query(query, function (error, results) {
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



// Giao diện tìm kiếm thông tin account -Search accounts
router.get('/staff/staff_search_accounts', (req, res) => {
    res.render('staff/staff_search_accounts')
});

// Giao diện tìm kiếm thông tin account -Search accounts fill up
router.get('/staff/staff_search_accounts_fillup', (req, res) => {
    res.render('staff/staff_search_accounts_fillup')
});



// Giao diện của Staff - chức năng xem danh sách khóa học
router.get('/staff/staff_search_results', (req, res) => {
    let id = localStorage.getItem("ID_Search");
    let fname = localStorage.getItem("FName_Search");
    let lname = localStorage.getItem("LName_Search");
    let phone = localStorage.getItem("Phone_Search");
    let year = localStorage.getItem("Year_Search");
    let dob = localStorage.getItem("DoB_Search");
    let faculty = localStorage.getItem("Faculty_Search");
    let actor = localStorage.getItem("Actor_Search");

    if (!id && !fname && !lname && !phone && !year && !dob && faculty != "Choose Falcuty" && actor == "Student") {
        database.query('SELECT * from Student where Student.Faculty = ?', [faculty], function (error, results) {
            if (error) {
                console.log("error ocurred while getting user details of " + id, error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                var temp = "";
                for (element in results) {
                    temp += results[element]["StudentID"] + "||" + results[element]["Fullname"] + "||" + results[element]["PhoneNumber"] + "||" + results[element]["StartYear"] + "||" + results[element]["DateOfBirth"] + "||" + results[element]["Faculty"] + "  ";
                }
                res.render('staff/staff_search_results', { data: temp });
            }
        });
    }
    if (!id && !fname && !lname && !phone && !year && !dob && faculty != "Choose Falcuty" && actor == "Lecturer") {
        database.query('SELECT * from Lecturer where Lecturer.Faculty = ?', [faculty], function (error, results) {
            if (error) {
                console.log("error ocurred while getting user details of " + id, error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                var temp = "";
                for (element in results) {
                    temp += results[element]["LecturerID"] + "||" + results[element]["Fullname"] + "||" + results[element]["PhoneNumber"] + "||" + results[element]["StartYear"] + "||" + results[element]["DateOfBirth"] + "||" + results[element]["Faculty"] + "  ";
                }
                res.render('staff/staff_search_results', { data: temp });
            }
        });
    }
    else {
        if (actor == "Lecturer") {
            fname = '%' + fname + '%';
            lname = '%' + lname;
            database.query('SELECT * from Lecturer where LecturerID = ? OR PhoneNumber = ? OR Fullname LIKE ? OR Fullname LIKE ? OR StartYear = ? OR Faculty = ?', [id, phone, fname, lname, year, faculty], function (error, results) {
                if (error) {
                    console.log("error ocurred while getting user details of " + id, error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    var temp = "";
                    for (element in results) {
                        temp += results[element]["LecturerID"] + "||" + results[element]["Fullname"] + "||" + results[element]["PhoneNumber"] + "||" + results[element]["StartYear"] + "||" + results[element]["DateOfBirth"] + "||" + results[element]["Faculty"] + "  ";
                    }
                    res.render('staff/staff_search_results', { data: temp });
                }
            });
        }
        else if (actor == "Student") {
            fname = '%' + fname + '%';
            lname = '%' + lname;
            database.query('SELECT * from Student where StudentID = ? OR PhoneNumber = ? OR Fullname LIKE ? OR Fullname LIKE ? OR StartYear = ? OR Faculty = ?', [id, phone, fname, lname, year, faculty], function (error, results) {
                if (error) {
                    console.log("error ocurred while getting user details of " + id, error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    });
                } else {
                    var temp = "";
                    for (element in results) {
                        temp += results[element]["StudentID"] + "||" + results[element]["Fullname"] + "||" + results[element]["PhoneNumber"] + "||" + results[element]["StartYear"] + "||" + results[element]["DateOfBirth"] + "||" + results[element]["Faculty"] + "  ";
                    }
                    res.render('staff/staff_search_results', { data: temp });
                }
            });
        }

    }
});
module.exports = router;


// LECTURER

//Giao diện của Lecturer - chức năng xem thông tin cá nhân.
router.get('/lecturer/lecturer_view_profile', (req, res) => {
    var id = localStorage.getItem("ID");
    console.log("ID", id);
    database.query('SELECT * from Lecturer where LecturerID = ?', id, function (error, results) {
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
                profile = profile + results[0][key] + "!";
            }
            res.render("lecturer/lecturer_view_profile", { user: profile });
        }
    });
});


// Giao diện đổi mật khẩu
router.get('/lecturer/lecturer_change_password', (req, res) => {
    res.render('lecturer/lecturer_change_password')
});

//Giao diện của Lecturer - chức năng sửa đổi thông tin cá nhân.
router.get('/lecturer/lecturer_change_profile', (req, res) => {
    res.render('lecturer/lecturer_change_profile')
});

// Lecturer - Xem danh sách các khóa học
router.get('/lecturer/lecturer_view_course', (req, res) => {
    var id = localStorage.getItem("ID");
    console.log("ID", id);
    database.query('SELECT Course.SubjectID,Name,Credit,Year,Semester,Class from Course,Subject where Course.SubjectID=Subject.SubjectID and LecturerID = ?', id, function (error, results) {
        if (error) {
            console.log("error ocurred while getting user details of " + id, error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log(results);
            var temp = "";
            for (element in results) {
                temp += results[element]["SubjectID"] + "||" + results[element]["Name"] + "||" + results[element]["Credit"] + "||" + results[element]["Year"] + "||" + results[element]["Semester"] + "||" + results[element]["Class"] + "  ";
            }
            console.log("temp: " + temp)
            res.render('lecturer/lecturer_view_course', { data: temp });
        }
    });
});



// Lecturer - Xem danh sách các khóa học khi bấm vào chức năng view class/course
router.get('/lecturer/lecturer_view_student', (req, res) => {
    var id = localStorage.getItem("ID");
    console.log("ID", id);
    database.query('SELECT Course.SubjectID,Name,Credit,Year,Semester,Class from Course,Subject where Course.SubjectID=Subject.SubjectID and LecturerID = ?', id, function (error, results) {
        if (error) {
            console.log("error ocurred while getting user details of " + id, error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log(results);
            var temp = "";
            for (element in results) {
                temp += results[element]["SubjectID"] + "||" + results[element]["Name"] + "||" + results[element]["Credit"] + "||" + results[element]["Year"] + "||" + results[element]["Semester"] + "||" + results[element]["Class"] + "  ";
            }
            console.log("temp: " + temp)
            res.render('lecturer/lecturer_view_student', { data: temp });
        }
    });
});


// Lecturer - Xem danh sách các khóa học khi bấm vào chức năng edit student grade
router.get('/lecturer/lecturer_edit_student', (req, res) => {
    var id = localStorage.getItem("ID");
    console.log("ID", id);
    database.query('SELECT Course.SubjectID,Name,Credit,Year,Semester,Class from Course,Subject where Course.SubjectID=Subject.SubjectID and LecturerID = ?', id, function (error, results) {
        if (error) {
            console.log("error ocurred while getting user details of " + id, error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log(results);
            var temp = "";
            for (element in results) {
                temp += results[element]["SubjectID"] + "||" + results[element]["Name"] + "||" + results[element]["Credit"] + "||" + results[element]["Year"] + "||" + results[element]["Semester"] + "||" + results[element]["Class"] + "  ";
            }
            console.log("temp: " + temp)
            res.render('lecturer/lecturer_edit_student', { data: temp });
        }
    });
});

// Lecturer - Xem danh sách học sinh khi bấm vào View Class/Course 
router.get('/lecturer/lecturer_view_student2/:subid.:subyear.:subSemester.:subClass', (req, res) => {
    console.log("SubID",req.params);
    let{subid,subyear,subSemester,subClass}  = req.params;
    var id = localStorage.getItem("ID");
    let query = `SELECT * from Course c join Student s on c.StudentID = s.StudentID where c.LecturerID = '${id}' and c.SubjectID ='${subid}' and c.Year=${subyear} and c.Semester=${subSemester} and c.Class='${subClass}'`;
    database.query(query,function (error, results,id) {
        if (error) {
            console.log("error ocurred while getting user details of ",id, error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log(results);
            var temp = "";
            for (element in results) {
                temp += results[element]["StudentID"] + "||" + results[element]["Fullname"] + "||" + results[element]["Midterm"] + "||" + results[element]["Final"] + "||" + results[element]["Total"] + "  ";
            }
            console.log("temp: " + temp)
            res.render('lecturer/lecturer_view_student2', { data: temp });
        }
    });
});



// Lecturer - Xem danh sách học sinh khi bấm vào Chức năng Edit's student grade
router.get('/lecturer/lecturer_edit_student2/:subid.:subyear.:subSemester.:subClass', (req, res) => {
    console.log("SubID",req.params);
    let{subid,subyear,subSemester,subClass}  = req.params;
    var id = localStorage.getItem("ID");
    let query = `SELECT * from Course c join Student s on c.StudentID = s.StudentID where c.LecturerID = '${id}' and c.SubjectID ='${subid}' and c.Year=${subyear} and c.Semester=${subSemester} and c.Class='${subClass}'`;
    database.query(query,function (error, results,id) {
        if (error) {
            console.log("error ocurred while getting user details of ",id, error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log(results);
            var temp = "";
            for (element in results) {
                temp += results[element]["StudentID"] + "||" + results[element]["Fullname"] + "||" + results[element]["Midterm"] + "||" + results[element]["Final"] + "||" + results[element]["Total"] + "  ";
            }
            console.log("temp: " + temp)
            res.render('lecturer/lecturer_edit_student2', { data: temp });
        }
    });
});

router.post('/lecturer/lecturer_edit_student2/edit', (req, res) => {
    let  { midterm, final, total,subId,year,semester,classId,studentId } = req.body;
    var id = localStorage.getItem("ID");
    let query = `Update Course SET Midterm =  ${midterm},Final=${final},Total=${total} where StudentID='${studentId}' and LecturerID = '${id}' and SubjectID = '${subId}' and Year=${year} and Semester=${semester} and Class='${classId}'`
    database.query(query,function (error, results,id) {
        if (error) {
            console.log("error ocurred while getting user details of ",id, error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log(results);
            res.send({
                "code": 200,
                "msg": "success"
            });
        }
    });
})