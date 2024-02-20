const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const messageController = require('../controllers/messageController')

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

/* GET join page. */
router.get('/join', userController.join_get);

/* POST join page. */
router.post('/join',userController.join_post);

// LOGOUT PAGE
router.get("/logout", userController.logout);

// Make a post 
router.get('/post', messageController.post_get);

// Make a post 
router.post('/post', messageController.post_post);

module.exports = router;
