// file này khá giống với .cpp bên C++, file này dùng để viết các hàm.
const dotenv = require('dotenv');
const csv = require('csv-parser');
const fs = require('fs');
dotenv.config({ path: './.env' });

//MYSQL
const mysql = require('mysql');
const database = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
})
var connection = mysql.createConnection({ multipleStatements: true });
const bcrypt = require('bcryptjs');

//Login.
exports.login = (req, res) => {
    const actor_choice = req.body.exampleRadios;
    console.log(actor_choice);

    // tương ứng với từng option mà ta sẽ nhảy tới trang login ứng với từng actor. (nhìn vào thì có thể các trang login này giống nhau nhưng thực chật lúc code hàm bên trong thì khác sẽ so sánh dựa trên type.)
    if (actor_choice == 'option1') { //option1 là Student., nếu đúng là option1 sẽ redirect (nhảy tới) trang login của student.
        res.status(200).redirect('/login_actors/login_student');
    } else if (actor_choice == 'option2') { // option 2 là Lecturer.
        res.status(200).redirect("/login_actors/login_lecturer");
    } else if (actor_choice == 'option3') { // option3 là Staff
        res.status(200).redirect("/login_actors/login_staff");
    }
}


//Login for student.
exports.login_student = async(req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);
        if (!username || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_student', {
                message: 'Please provide an username and password.'
            })
        }

        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 1 AND ID = ?', [username], async(error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (!results) {
                return res.status(400).render('../views/login_actors/login_student', {
                    message: 'Username or Password is incorrect'
                })
            } else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 username.
                return res.status(400).render('../views/login_actors/login_student', {
                    message: 'Username or Password is incorrect'
                })
            } else { // login thành công.
                console.log('Login successful');
                console.log(results[0].Username);
                return res.status(200).redirect('../../student/student_UI');
            }
        })
    } catch (error) {
        console.log(error);
    }
}


//Login for Lecturer.
exports.login_lecturer = async(req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);
        if (!username || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_lecturer', {
                message: 'Please provide an username and password.'
            })
        }

        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 2 AND ID = ?', [username], async(error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (!results) {
                console.log(1234);
                return res.status(400).render('../views/login_actors/login_lecturer', {
                    message: 'Username or Password is incorrect'
                })
            } else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 username.
                return res.status(400).render('../views/login_actors/login_lecturer', {
                    message: 'Username or Password is incorrect'
                })
            } else { // login thành công.
                console.log('Login successful');
                console.log(results[0].Username);
                return res.status(200).redirect('../../lecturer/lecturer_UI');
            }
        })
    } catch (error) {
        console.log(error);
    }
}



//Login for staff.
exports.login_staff = async(req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);
        if (!username || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_staff', {
                message: 'Please provide an username and password.'
            })
        }

        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 3 AND ID = ?', [username], async(error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (!results) {
                console.log(1234);
                return res.status(400).render('../views/login_actors/login_staff', {
                    message: 'Username or Password is incorrect'
                })
            } else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 username.
                return res.status(400).render('../views/login_actors/login_staff', {
                    message: 'Username or Password is incorrect'
                })
            } else { // login thành công.
                console.log('Login successful');
                user = results[0].Username;
                console.log(user);
                return res.status(200).redirect('../../staff/staff_UI');
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// tạo tài khoản bằng form
exports.account_form = async(req, res) => {
    try {
        const { id, fullname, phone, year, DoB, password, passwordConfirm, faculty } = req.body; // đọc dữ liệu sau khi nhấn submit
        const type = req.body.inlineRadioOptions; // loại account cần tạo
        if (!id || !fullname || !phone || !year || !DoB || !password || !faculty || !type) { // trường hợp nhập không đủ thông tin
            return res.status(400).render('../views/staff/account_form', {
                message: 'Please provide full necessary information of account.'
            })
        }

        database.query('Select * from Account where Account.ID = ?', [id], async(error, results) => {
            if (results.length > 0) {
                return res.status(400).render('../views/staff/account_form', {
                    message: 'Account has already existed'
                })
            } else if (password !== passwordConfirm) {
                return res.status(400).render('../views/staff/account_form', {
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
                        return res.status(400).render('../views/staff/account/form', {
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
                        return res.status(400).render('../views/staff/account_form', {
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
exports.account_file = async(req, res) => {
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

                return res.status(400).render('../views/staff/account_file', {
                    message: `Created successfully!`
                })
            });
    } catch (error) {
        console.log(error);
    }
}