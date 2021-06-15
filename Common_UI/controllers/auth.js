// file này khá giống với .cpp bên C++, file này dùng để viết các hàm.
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

//MYSQL
const mysql = require('mysql');
const database = mysql.createConnection({
    host: process.env.DATABASE_HOST, //'localhost',
    user: process.env.DATABASE_USER, //'root',
    password: process.env.DATABASE_PASSWORD, //'',
    database: process.env.DATABASE
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
        const { username, password } = req.body;
        console.log(req.body);
        if (!username || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_student', {
                message: 'Please provide an username and password.'
            })
        }
        
        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 1 AND username = ?', [username], async (error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (!results) {
                console.log(1234);
                return res.status(400).render('../views/login_actors/login_student', {
                    message: 'Username or Password is incorrect'
                })
            }
            else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 username.
                return res.status(400).render('../views/login_actors/login_student', {
                    message: 'Username or Password is incorrect'
                })
            }
            else { // login thành công.
                console.log('Login successful');
                console.log(results[0].Username);
                return res.status(200).render('../views/student/student_UI'); 
            }
        })
    } catch (error) {
        console.log(error);
    }
}


//Login for Lecturer.
exports.login_lecturer = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);
        if (!username || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_lecturer', {
                message: 'Please provide an username and password.'
            })
        }
        
        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 2 AND username = ?', [username], async (error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (!results) {
                console.log(1234);
                return res.status(400).render('../views/login_actors/login_lecturer', {
                    message: 'Username or Password is incorrect'
                })
            }
            else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 username.
                return res.status(400).render('../views/login_actors/login_lecturer', {
                    message: 'Username or Password is incorrect'
                })
            }
            else { // login thành công.
                console.log('Login successful');
                console.log(results[0].Username);
                return res.status(200).render('../views/lecturer/lecturer_UI'); 
            }
        })
    } catch (error) {
        console.log(error);
    }
}



//Login for Lecturer.
exports.login_staff = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);
        if (!username || !password) { //trường hợp để trống không nhập gì mà nhấn Submit.
            return res.status(400).render('../views/login_actors/login_staff', {
                message: 'Please provide an username and password.'
            })
        }
        
        // Truy vấn để lấy dữ liệu type =1 là học sinh.
        database.query('Select *from Account where Account.Type = 3 AND username = ?', [username], async (error, results) => {
            console.log(results);
            //!result: tức là sau khi tủy vấn không có kết quả trả về.
            //!await bcrypt:  là dùng để so sánh password.
            if (!results) {
                console.log(1234);
                return res.status(400).render('../views/login_actors/login_staff', {
                    message: 'Username or Password is incorrect'
                })
            }
            else if (!(await bcrypt.compareSync(password, results[0].Password))) { // result[0] là bởi vì chỉ có 1 kết quả trả về tương ứng với 1 username.
                return res.status(400).render('../views/login_actors/login_staff', {
                    message: 'Username or Password is incorrect'
                })
            }
            else { // login thành công.
                console.log('Login successful');
                console.log(results[0].Username);
                return res.status(200).render('../views/staff/staff_UI'); 
            }
        })
    } catch (error) {
        console.log(error);
    }
}


