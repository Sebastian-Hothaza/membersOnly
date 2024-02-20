const Message = require('../models/message')
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.post_get = (req, res, next) => res.render('post')

exports.post_post = [
    // Validate and sanitize input
    body("title", "Title must contain at least 2 characters").trim().isLength({ min: 2 }).escape(),
    body("message", "Message must contain at least 5 characters").trim().isLength({ min: 5 }).escape(),

    
    asyncHandler(async (req, res, next) =>{
        // Extract the validation errors from a request.
        const errors = validationResult(req);

   
        // Create user object
        const posting = new Message({
            title: req.body.title,
            message: req.body.message,
            author: req.user.id,
            timestamp: new Date()
        })

        if (!errors.isEmpty()){
            // There are errors with registration form. Re-render it again
            res.render('post', {errors: errors.array(), posting}); 
        }else{
            // Form data is valid
            await posting.save();
            res.redirect('/')
        }
        
    })
]