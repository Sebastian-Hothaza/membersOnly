const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const passport = require("passport");
const bcrypt = require('bcryptjs')


// HOMEPAGE
exports.index = asyncHandler(async (req, res, next) => {
    // Get all messges from DB
    const allMessages = "TODO: Fetch ALL MESSAGES FROM DB"
    res.render("index", {allMessages, user: req.user}); //user is attached as cookie! 
})

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
                res.redirect('/')
            }
        })
    })
]


// LOG IN
exports.login_get = (req, res, next) => res.render('login')
exports.login_post = [
    // TODO: Validate and sanitize input
    (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/logind"
        })(req, res, next)
    }
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