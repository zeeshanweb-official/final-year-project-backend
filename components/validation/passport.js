const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../userSchema");
module.exports = function(passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      //match user
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: "user is not available" });
          } else {
            bcrypt.compare(password, user.password, (err, ismatch) => {
              if (err) {
                throw err;
              }
              if (ismatch) {
                done(null, user);
              } else {
                done(null, false, { message: "password incorrect" });
              }
            });
          }
        })
        .catch(err => console.log("err", err));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
