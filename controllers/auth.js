// file này khá giống với .cpp bên C++, file này dùng để viết các hàm.
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

//ASYNC 
var async = require('async');

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

const bcrypt = require('bcryptjs');

//Login.
exports.login = (req, res) => {
    const actor_choice = req.body.exampleRadios;
    console.log(actor_choice);
   
    // tương ứng với từng option mà ta sẽ nhảy tới trang login ứng với từng actor. (nhìn vào thì có thể các trang login này giống nhau nhưng thực chật lúc code hàm bên trong thì khác sẽ so sánh dựa trên type.)
    if (actor_choice == 'option1') { //option1 là Student., nếu đúng là option1 sẽ redirect (nhảy tới) trang login của student.
        res.status(200).redirect('/login_actors/login_student');
    }
    else if (actor_choice == 'option2') { // option 2 là Lecturer.
        res.status(200).redirect("/login_actors/login_lecturer");
    }
    else if (actor_choice == 'option3') { // option3 là Staff
        res.status(200).redirect("/login_actors/login_staff");
    }
}


//Login for student.
exports.login_student = async (req, res) => {
    try {
        const {id, password } = req.body;
        console.log(req.body);
        if (!id || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_student', {
                message: 'Please provide an id and password.'
            })
        }
        
        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 1 AND id = ?', [id], async (error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (results.length == 0) {
                return res.status(400).render('../views/login_actors/login_student', {
                    message: 'ID or Password is incorrect'
                })
            }
            else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 id.
                return res.status(400).render('../views/login_actors/login_student', {
                    message: 'ID or Password is incorrect'
                })
            }
            else { // login thành công.
                console.log('Login successful');
                console.log(results[0].ID);
                return res.status(200).redirect('../../student/student_UI');
            }
        })
    } catch (error) {
        console.log(error);
    }
}


//Login for Lecturer.
exports.login_lecturer = async (req, res) => {
    try {
        const { id, password } = req.body;
        console.log(req.body);
        if (!id || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_lecturer', {
                message: 'Please provide an id and password.'
            })
        }
        
        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 2 AND id = ?', [id], async (error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (results.length == 0) {
                console.log(1234);
                return res.status(400).render('../views/login_actors/login_lecturer', {
                    message: 'ID or Password is incorrect'
                })
            }
            else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 id.
                return res.status(400).render('../views/login_actors/login_lecturer', {
                    message: 'ID or Password is incorrect'
                })
            }
            else { // login thành công.
                console.log('Login successful');
                console.log(results[0].ID);
                return res.status(200).redirect('../../lecturer/lecturer_UI');
            }
        })
    } catch (error) {
        console.log(error);
    }
}



//Login for staff.
exports.login_staff = async (req, res) => {
    try {
        const { id, password } = req.body;
        console.log(req.body);
        if (!id || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_staff', {
                message: 'Please provide an id and password.'
            })
        }
        
        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 3 AND ID = ?', [id], async (error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (results.length == 0) {
                console.log(1234);
                return res.status(400).render('../views/login_actors/login_staff', {
                    message: 'ID or Password is incorrect'
                })
            }
            else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 id.
                return res.status(400).render('../views/login_actors/login_staff', {
                    message: 'ID or Password is incorrect'
                })
            }
            else { // login thành công.
                console.log('Login successful');
                console.log(results[0].ID);
                return res.status(200).redirect('../../staff/staff_UI');
            }
        })
    } catch (error) {
        console.log(error);
    }
}


// //Staff- chức năng Remove Account - Option 1 (Remove 1 Account)
exports.staff_remove_account_option1 = async (req, res) => {
    try {
        const {id} = req.body;
        console.log(req.body);
        if (!id) { //trường hợp để trống không nhập gì mà nhấn Remove.
            return res.status(400).render('../views/staff/staff_remove_account_option1', {
                message: 'Please provide an id.'
            })
        }
        
        
        database.query('Select *from Account where ID = ?', [id], async (error, results) => {
            console.log(results);
            //!result: tức là sau khi truy vấn không có kết quả trả về.
            if (results.length == 0) {
                return res.status(400).render('../views/staff/staff_remove_account_option1', {
                    message: 'This ID does not exist.'
                })
            }
            else if (results[0].ID == id && results[0].Type != 3) { // tìm thấy acôunt có trong database
                if (results[0].Type == 1) {
                    database.query(`DELETE FROM Student WHERE StudentID = ?`, id, function(err) {
                        if (err) {
                            return console.error(err.message);
                        }
                    });
                }
                else if (results[0].Type == 2) {
                    database.query(`DELETE FROM Lecturer WHERE LecturerID = ?`, id, function(err) {
                        if (err) {
                            return console.error(err.message);
                        }
                    });
                }
                database.query(`DELETE FROM Account WHERE ID = ?`, id, function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                });
                // close the database connection
                console.log('Remove successfully');
                return res.status(400).render('../views/staff/staff_remove_account_option1'), {
                    message: 'Remove Account Successfully.'
                };
            }
            else if (results[0].Type == 3){
                return res.status(400).render('../views/staff/staff_remove_account_option1', {
                    message: 'You cannot remove a Staff account.'
                })
            }
        })
    } catch (error) {
        console.log(error);
    }
}


// //Staff- chức năng Remove Account - Option 2 (Remove many Account)




function makePromiseFunc (idx) {
    return new Promise(function (res, rej) {
        console.log(idx);
        database.query (
            "DELETE FROM Student WHERE StudentID = ?; DELETE FROM Account WHERE ID =?", [idx, idx], function (error) {
                if (error) {
                    return console.error(error.message);   
            }
        });
    });
}
  

exports.staff_remove_account_option2 = (req, res) => {
    try {
        let id = req.body.data;
    
        for (let i = 1; i < id.length - 1; i++) {
            id[i].split('\r');
            id[i] = id[i].slice(0, -1);
        }
        var p = new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve('foo');
            }, 3000);
        });

        for (var i = 1; i < id.length; i++) {
        // Assign variables to the same
            p = p.then (makePromiseFunc (id[i]));
        }
        
        res.status(200).redirect('../../staff/staff_remove_account_option2');
    }
    catch (error) {
        console.log(error);
    }
}