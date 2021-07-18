//This file has all the function for each key feature.
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

//ASYNC 
var async = require('async');
const csv = require('csv-parser');
const fs = require('fs');


//LOCAL STORAGE:
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

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
        localStorage.setItem("ID", id);
        localStorage.setItem("Password",password);
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
                    console.log(id);
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
                    else {
                        console.log('Remove successfully');
                        return res.status(200).render('../views/staff/staff_remove_account_option1'), {
                            message: 'Remove Account Successfully.'
                        };
                    }
                });
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
        console.log(req.body);
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
        if (true) {
            return res.render('../views/staff/staff_remove_account_option2', {
                message: 'Remove successfully!'
            })
        }
        
    }
    catch (error) {
        console.log(error);
    }
}



// tạo tài khoản bằng form
exports.staff_account_form = async(req, res) => {
    try {
        const { id, fullname, phone, year, DoB, password, passwordConfirm, faculty } = req.body; // đọc dữ liệu sau khi nhấn submit
        const type = req.body.inlineRadioOptions; // loại account cần tạo
        if (!id || !fullname || !phone || !year || !DoB || !password || !faculty || !type) { // trường hợp nhập không đủ thông tin
            return res.status(400).render('../views/staff/staff_account_form', {
                message: 'Please provide full necessary information of account.'
            })
        }

        database.query('Select * from Account where Account.ID = ?', [id], async(error, results) => {
            if (results.length > 0) {
                return res.status(400).render('../views/staff/staff_account_form', {
                    message: 'Account has already existed'
                })
            } else if (password !== passwordConfirm) {
                return res.status(400).render('../views/staff/staff_account_form', {
                    message: 'Passwords do not match'
                })
            }

            let hashedPassword = await bcrypt.hashSync(password, 8);

            if (type === "student") {
                database.query('Insert into Account set ?', { ID: id, Password: hashedPassword, Type: 1 })
                database.query('Insert into Student set ?', { StudentID: id, Fullname: fullname, PhoneNumber: phone, StartYear: year, DateOfBirth: DoB, Password: hashedPassword, Faculty: faculty }, (error, results) => {
                    if (error) {
                        console.log(error)
                    } else {
                        return res.status(400).render('../views/staff/staff_account_form', {
                            message: 'Account created successfully!'
                        })
                    }
                })
            } else {
                database.query('Insert into Account set ?', { ID: id, Password: hashedPassword, Type: 2 })
                database.query('Insert into Lecturer set ?', { LecturerID: id, Fullname: fullname, PhoneNumber: phone, StartYear: year, Faculty: faculty, Password: hashedPassword, DateOfBirth: DoB }, (error, results) => {
                    if (error) {
                        console.log(error)
                    } else {
                        return res.status(400).render('../views/staff/staff_account_form', {
                            message: 'Account created successfully!'
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// tạo tài khoản bằng csv
exports.staff_account_file = async(req, res) => {
    try {
        let info = []; // lưu thông tin trong csv
        fs.createReadStream(req.body.file) // đọc csv
            .pipe(csv({ delimiter: ',' }))
            .on('data', (row) => {
                info.push(row); // thêm thông tin
            })
            .on('end', () => { // sau khi đọc file xong
                let id = [];
                let count = 0;
                for (let i = 0; i < info.length; i++) { // thay đổi một số thuộc tính vì file csv lưu không đúng định dạng
                    for (let property in info[i]) {
                        if (property.length == 3)
                            id.push(info[i][property]);
                        else if (property == 'PhoneNumber')
                            info[i][property] = info[i][property].replace(' ', '');
                        else if (property == "DateOfBirth")
                            info[i][property] = info[i][property].replace(/ /g, '/');
                    }
                }

                for (let i = 0; i < info.length; i++) { // quá trình thêm vào database
                    if (info[i]['Type'] == "Student") {
                        database.query('Select * from Account where Account.ID = ?', [id[i]], async(error, results) => {
                            if (results.length === 0) {
                                count++;
                                let hashedPassword = await bcrypt.hashSync(info[i]['Password'], 8);

                                database.query('Insert into Account set ?', { ID: id[i], Password: hashedPassword, Type: 1 });
                                database.query('Insert into Student set ?', { StudentID: id[i], Fullname: info[i]['Fullname'], PhoneNumber: info[i]['PhoneNumber'], StartYear: info[i]['StartYear'], DateOfBirth: info[i]['DateOfBirth'], Password: hashedPassword, Faculty: info[i]['Faculty'] }, (error, results) => {
                                    if (error) {
                                        console.log(error)
                                    }
                                })
                            }
                        })
                    } else {
                        database.query('Select * from Account where Account.ID = ?', [id[i]], async(error, results) => {
                            if (results.length === 0) {
                                count++;
                                let hashedPassword = await bcrypt.hashSync(info[i]['Password'], 8);

                                database.query('Insert into Account set ?', { ID: id[i], Password: hashedPassword, Type: 2 });
                                database.query('Insert into Lecturer set ?', { LecturerID: id[i], Fullname: info[i]['Fullname'], PhoneNumber: info[i]['PhoneNumber'], StartYear: info[i]['StartYear'], DateOfBirth: info[i]['DateOfBirth'], Password: hashedPassword, Faculty: info[i]['Faculty'] }, (error, results) => {
                                    if (error) {
                                        console.log(error)
                                    }
                                })
                            }
                        })
                    }
                }

                return res.status(400).render('../views/staff/staff_account_file', {
                    message: `Created successfully!`
                })
            });
    } catch (error) {
        console.log(error);
    }
}



//STAFF - CHANGE PROFILE.
function Update_Data (id, info, index) {
    return new Promise(function (res, rej) {
        if (info != '') {
            if (index == 0) {
                database.query (
                    "Update Staff Set Fullname = ? WHERE StaffID = ?", [info, id], function (error) {
                        if (error) {
                            return console.error(error.message);   
                    }
                });
            }
            else if (index == 1) {
                database.query (
                    "Update Staff Set PhoneNumber = ? WHERE StaffID = ?", [info, id], function (error) {
                        if (error) {
                            return console.error(error.message);   
                    }
                });
            }
            else if (index == 2) {
                database.query (
                    "Update Staff Set StartYear = ? WHERE StaffID = ?", [info, id], function (error) {
                        if (error) {
                            return console.error(error.message);   
                    }
                });
            }
            else if (index == 3) {
                database.query (
                    "Update Staff Set DateOfBirth = ? WHERE StaffID = ?", [info, id], function (error) {
                        if (error) {
                            return console.error(error.message);   
                    }
                });
            }
            else if (index == 4) {
                database.query (
                    "Update Staff Set Address = ? WHERE StaffID = ?", [info, id], function (error) {
                        if (error) {
                            return console.error(error.message);   
                    }
                });
            }
        }
    });
}

exports.staff_change_profile = async (req, res) => {
    try {
        console.log(req.body);
        var id = localStorage.getItem("ID");
        console.log(id);
        const { fullname, phone, year, DoB, address } = req.body;
        
        var p = new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve('foo');
            }, 3000);
        });

        if (!fullname && !phone && !year && !DoB && !address){
            return res.status(400).render('../views/staff/staff_change_profile', {
                message: 'Provide at least 1 data!'
            })
        }
        else {
            if (phone.length > 0 && phone.length < 10) {
                return res.status(400).render('../views/staff/staff_change_profile', {
                    message: 'Phone has 10 numbers'
                })
            }
            else if (year.length > 0 && year.length < 4) {
                return res.status(400).render('../views/staff/staff_change_profile', {
                    message: 'Wrong start year!'
                })
            }
            else if (year.length == 4 && (Number(year) < 1995 || Number(year)> 2021)) {
                return res.status(400).render('../views/staff/staff_change_profile', {
                    message: 'Wrong start year!'
                })
            }
            else {
                let data = [];
                data.push(fullname);
                data.push(phone);
                data.push(year);
                data.push(DoB);
                data.push(address);
                for (var i = 0; i < data.length; i++) {
                // Assign variables to the same
                    p = p.then (Update_Data (id,data[i], i));
                }
                return res.status(400).render('../views/staff/staff_change_profile', {
                    message: 'Update successfully!'
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

//Staff- Change Password;
// thay đổi mật khẩu
exports.staff_change_password = async(req, res) => {
    const password = localStorage.getItem('Password');
    const id = localStorage.getItem('ID');
    const { oldPassword, newPassword, passwordConfirm } = req.body;

    if (!oldPassword || !newPassword || !passwordConfirm) { // trường hợp nhập không đủ thông tin
        return res.status(400).render('../views/staff/staff_change_password', {
            message: 'Please provide full necessary information.'
        })
    }

    if (oldPassword !== password) { // trường hợp nhập sai mật khẩu hiện tại
        return res.status(400).render('../views/staff/staff_change_password', {
            message: 'Old password does not match.'
        })
    }

    if (newPassword !== passwordConfirm) { // trường hợp nhập sai mật khẩu xác nhận
        return res.status(400).render('../views/staff/staff_change_password', {
            message: 'Password confirm does not match.'
        })
    }

    let hashedPassword = await bcrypt.hashSync(newPassword, 8);

    database.query('Update Account set Password = ? where ID = ?', [hashedPassword, id]);
    database.query('Update Staff set Password = ? where StaffID = ?', [hashedPassword, id]);
    localStorage.setItem("Password", newPassword);
    return res.status(400).render('../views/staff/staff_change_password', {
        message: 'Changed successfully!'
    })
}







exports.staff_search_accounts = async(req, res) => {
    console.log(req.body)
    const { id, first_name, last_name, phone, year, DoB, faculty, actor } = req.body
    if (!id && !first_name && !last_name && !phone && !year && !DoB && faculty == "Choose Faculty" && actor =="Choose Actor") {
        return res.status(400).render('../views/staff/staff_search_accounts', {
            message: 'Provide at least 1 data!'
        })
    }

    if (actor =="Choose Actor") {
        return res.status(400).render('../views/staff/staff_search_accounts', {
            message:  'Please choose actor to search!'
        })
    }
    
    if (phone.length > 0 && phone.length < 10) {
        return res.status(400).render('../views/staff/staff_search_accounts', {
            message:  'Phone number has 10 numbers!'
        })
    }

    localStorage.setItem('ID_Search', id);
    localStorage.setItem('FName_Search', first_name);
    localStorage.setItem('LName_Search', last_name);
    localStorage.setItem('Phone_Search', phone);
    localStorage.setItem('Year_Search', year);
    localStorage.setItem('DoB_Search', DoB);
    localStorage.setItem('Faculty_Search', faculty);
    localStorage.setItem('Actor_Search', actor);
    
    return res.render('../views/staff/staff_search_accounts_fillup')

}