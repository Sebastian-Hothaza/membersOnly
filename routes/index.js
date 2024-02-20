const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', userController.index);

/* GET register page. */
router.get('/register', userController.register_get);

/* POST register page. */
router.post('/register',userController.register_post) 

/* GET login page. */
router.get('/login', userController.login_get);

/* POST login page. */
router.post('/login',userController.login_post);

// LOGOUT PAGE
router.get("/logout", userController.logout);

module.exports = router;
