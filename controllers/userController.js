const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.index = asyncHandler(async (req, res, next) => {
    // Get all messges from DB
    const allMessages = "TODO: Fetch ALL MESSAGES FROM DB"

    res.render("index", {allMessages});
})

exports.register_get = (req, res, next) =>{
    res.render('register')
}

exports.register_post = (req, res, next) =>{
    res.send('NOT YET IMPLEMENTED: REGISTER POST')
}

exports.login_get = (req, res, next) =>{
    res.render('login')
}

exports.login_post = (req, res, next) =>{
    res.send('NOT YET IMPLEMENTED: LOGIN POST')
}