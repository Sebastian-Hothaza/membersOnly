const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
const User=require('./models/user')


const indexRouter = require('./routes/index');

const app = express();

// Passport setup
const session = require("express-session");
const passport = require("passport");
//const initalizePassport = require('./passport-config')

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
//initalizePassport.initialize(passport);
passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("LOCAL STRATEGY RUNNING")
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect password" });
      
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
});

app.use(passport.initialize());
app.use(passport.session());


// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() { 
  await mongoose.connect(process.env.MONGODB_URI);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);



// If you insert this code somewhere between where you instantiate the passport middleware and before you render your views,
// you will have access to the currentUser variable in all of your views, and you won’t have to manually pass it into all of the controllers in which you need it.
// app.use((req, res, next) => {
//   res.locals.currentUser = req.user;
//   next();
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
