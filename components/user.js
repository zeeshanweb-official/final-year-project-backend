const express = require("express");
const router = express.Router();
const Users = require("./userSchema");
const bcrypt = require("bcrypt");
const passport = require("passport");

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/main",
//     failureRedirect: "/failed",
//     successMessage: "success",
//     failureMessage: "not logged in"
//   })(req, res, next);
// });

router.post("/register", function(req, res) {
  if (!req.body.email || !req.body.password || !req.body.useras) {
    res.send("all fields are compulsory");
  } else {
    const saltRounds = 10;
    async function savedata() {
      await bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          let User = new Users({
            email: req.body.email,
            password: hash,
            type: req.body.useras
          });
          User.save((err, obj) => {
            if (err) {
              res.send(err);
            } else {
              res.send(obj);
            }
          });
        });
      });
    }
    savedata();
  }
});
module.exports = router;
