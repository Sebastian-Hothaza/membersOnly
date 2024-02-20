const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const passport = require("passport");
const bcrypt = require('bcryptjs')




// REGISTER
exports.register_get = (req, res, next) => res.render('register')
exports.register_post = [
    // Validate and sanitize input
    body("fname", "First name must contain at least 2 characters").trim().isLength({ min: 2 }).escape(),
    body("lname", "Last name must contain at least 2 characters").trim().isLength({ min: 2 }).escape(),
    body("username", "Username must contain at least 2 characters").trim().isLength({ min: 2 }).escape(),
    body('password', "Password must be at least 6 charcters").trim().isLength({ min: 6 }).escape(),
    body('password_again', "Password confirmation does not match password").custom((value, { req }) => {
        return value === req.body.password;
      }),
    

    asyncHandler(async (req, res, next) =>{
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            // Create user object
            const user = new User({
                name: {first_name: req.body.fname, last_name: req.body.lname},
                username: req.body.username,
                password: hashedPassword,
                memberType: "regular"
            })

            if (!errors.isEmpty()){
                // There are errors with registration form. Re-render it again
                res.render('register', {errors: errors.array(), user}); 
            }else{
                // Form data is valid
                await user.save();
                res.redirect('/login')
            }
        })
    })
]


// LOG IN
exports.login_get = (req, res, next) => res.render('login')
exports.login_post = [
    body("username", "Username must contain at least 2 characters").trim().isLength({ min: 2 }).escape(),
    body("password").escape(),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            // There are errors with login form. Re-render it again
            res.render('login', {errors: errors.array()}); 
        }else{
            // Form data is valid, attempt to authenticate the user
            passport.authenticate("local", {
                successRedirect: "/",
                failureRedirect: "/login",
                failureMessage: true
            })(req,res,next)
        }
    },
]

// LOG OUT
exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
};

// JOIN
exports.join_get = (req, res, next) => {
    res.render('join');
}


exports.join_post = [
    body("secretCode", "SecretCode must contain at least 2 characters").trim().isLength({ min: 2 }).escape(),

    asyncHandler (async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            // There are errors with join form. Re-render it again
            res.render('join', {errors: errors.array()}); 
        }else{
            // Form data is valid, verify secret code and update user DB
            if (req.body.secretCode == process.env.SECRET_CODE){
                // Update DB
                // Create a new users object
                const user = new User({
                    name: req.user.name,
                    username: req.user.username,
                    password: req.user.password,
                    memberType: "member",
                    _id: req.user._id
                })
                await User.findByIdAndUpdate(req.user.id, user, {});
                
            }
            res.redirect('/');
        }
    }),
]