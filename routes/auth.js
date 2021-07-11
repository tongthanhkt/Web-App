// bất kỳ file hbs nào có submit thì nằm ở đây.
const express = require('express');

const authController = require('../controllers/auth');
const router = express.Router();

router.post('/login', authController.login);

router.post('/login_actors/login_student', authController.login_student);
router.post('/login_actors/login_lecturer', authController.login_lecturer);
router.post('/login_actors/login_staff', authController.login_staff);



//Staff- chức năng Remove Account - Option 1 (Remove 1 Account)
router.post('/staff/staff_remove_account_option1', authController.staff_remove_account_option1);


//Staff- chức năng Remove Account - Option 1 (Remove 1 Account)
router.post('/staff/staff_remove_account_option2', authController.staff_remove_account_option2);
module.exports = router;