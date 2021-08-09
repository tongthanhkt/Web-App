// bất kỳ file hbs nào có submit thì nằm ở đây.
const express = require("express");

const authController = require("../controllers/auth");
const router = express.Router();

router.post("/login", authController.login);
router.post("/login_actors/login_student", authController.login_student);
router.post("/login_actors/login_lecturer", authController.login_lecturer);
router.post("/login_actors/login_staff", authController.login_staff);

//Staff- chức năng Remove Account - Option 1 (Remove 1 Account)
router.post(
  "/staff/staff_remove_account_option1",
  authController.staff_remove_account_option1
);

//Staff- chức năng Remove Account - Option 1 (Remove 1 Account)
router.post(
  "/staff/staff_remove_account_option2",
  authController.staff_remove_account_option2
);

//Staff- chức năng Create Account - Tạo tài khaonr bằng form.
router.post("/staff/account_form", authController.account_form);

//Staff- chức năng Create Account - Tạo tài khaonr bằng file csv.
router.post("/staff/account_file", authController.account_file);

//Staff- chức năng Change Profile - Sửa đổi thông tin tài khoản
router.post(
  "/student/student_change_profile",
  authController.student_change_profile
);
router.post(
  "/student/student_change_password",
  authController.student_change_password
);
module.exports = router;
