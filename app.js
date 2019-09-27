const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose
  .connect("mongodb://localhost:27017/Yaseen_Clinic")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => console.log("could not Connect to MONGODB err: " + err));
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3004;
const Doctor = require("./components/Doctors");
const Patient = require("./components/Patients");
const Department = require("./components/Departments");
const Evts = require("./components/events");
const User = require("./components/user");
const Medicine = require("./components/medicines");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "we have a secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use("/Doctors", Doctor);
app.use("/Patients", Patient);
app.use("/Departments", Department);
app.use("/eventsAPI", Evts);
app.use("/user", User);
app.use("/medicine", Medicine);
const passport = require("passport");
require("./components/validation/passport")(passport);
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);
app.get("/images/:image", function(req, res) {
  let imgDir = "uploads/";
  try {
    fs.statSync(imgDir + req.params.image);
    res.sendFile(imgDir + req.params.image, { root: __dirname });
  } catch (e) {
    fs.statSync(imgDir + "defaultimage.jpg");
    res.sendFile(imgDir + "defaultimage.jpg", { root: __dirname });
  }
});
app.get("/extrafiles/:image", function(req, res) {
  let imgDir = "uploads/patients/";
  try {
    fs.statSync(imgDir + req.params.image);
    res.sendFile(imgDir + req.params.image, { root: __dirname });
  } catch (e) {
    fs.statSync(imgDir + "defaultimage.jpg");
    res.sendFile(imgDir + "defaultimage.jpg", { root: __dirname });
  }
});
app.post("/getdata", function(req, res) {
  console.log(req.body);
});

app.use(passport.initialize());
app.use(passport.session());
app.post("/login", (req, res, next) => {
  if (req.user) {
    return res.send(req.user, "user already signin");
  } else {
    passport.authenticate("local", function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send("login failed");
      }
      // make passportjs setup the user object, serialize the user, ...
      req.login(user, {}, function(err) {
        if (err) {
          return next(err);
        }
        return res.send(user);
      });
    })(req, res, next);
  }
});
app.get("/logout", function(req, res) {
  req.logout();
  res.send("shani logout");
});
app.listen(port, () => {
  console.log("listening on port " + port);
});
