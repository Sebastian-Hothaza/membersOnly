const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
const User=require('./models/user')

exports.initialize = (passport) => {
    //  setting up the LocalStrategy, called by passport automatically when we use the passport.authenticate() function later.
  passport.use(
    new LocalStrategy(async (username, password, done) => {
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
}