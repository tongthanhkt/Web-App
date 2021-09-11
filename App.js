const express = require("express");
const app = express();

//COOKIES:
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
//HOMEPAGE.
const path = require("path");
app.set("view engine", "hbs");
const publicDirectory = path.join(__dirname, "./public");
console.log(__dirname);
app.use(express.static(publicDirectory));

// 2 hàm này dùng để nhận .json mỗi khi nhấn submit, ... từ đó ms có đc thông tin mà người dùng nhập.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nếu không sử dụng routes.
// app.get('/', (req, res) => {
//     //res.send('<h1>HomePage</h1>')
//     res.render('index')
// });

// app.get('/login', (req, res) => {
//     //res.send('<h1>HomePage</h1>')
//     res.render('login')
// });

// Nếu sử dụng routes. "ký hiệu ./ là cùng thu mục với file đang code."
// //Define Routes.
app.use("/", require("./routes/pages"));
app.use("/auth/", require("./routes/auth"));

// dùng để tạo port
app.listen(10001, () => {
  console.log("Server started on port 10001");
});

//DOTENV. //using .env file protect information in the database of mysql.
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

//MYSQL :  kết nối với mysql từ phpAdmin.
const mysql = require("mysql");
const database = mysql.createConnection({
  //Link MYSQL khi không dùng .env
  // host: 'localhost', // sử dụng trên máy tính của mình --> Localhost.
  // user: 'root', // do sử  dụng XAMPP nên user mặc định là host, password trống không.
  // password: '',
  // database: 'MoodleMini' // tên database mà mình đặt trong mysql của phpAdmin.

  //Link MySQL khi sử dụng .env, lúc này thay vì để lộ thông tin thì ta dùng biến khác để che đi, thông tin chi tiết nằm ở file .env
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
});

//kết nới với sql.
database.connect(error => {
  if (error) {
    console.log(error);
  } else {
    // nếu kết nối thành công thì ở terminal sẽ in ra MySQL connected.
    console.log("MySQL connected.");
  }
});

// Buộc phải có hàm này, bởi vì khi kết nới vs sql ở trên internet sẽ có khoảng thời gian timeout
// Nếu hết thời gian timeout đó (ý là trong quá trình đó ko sử dụng truy vấn) ==> server sẽ đóng ==> ném ra lỗi error.
// Để server ko đóng ==> dùng hàm này để liên tục truy vấn ==> Chương trình chạy bth.
setInterval(function () {
  database.query("SELECT 1");
}, 10001);
