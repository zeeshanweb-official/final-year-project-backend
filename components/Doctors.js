const express = require("express");
const router = express.Router();
const Doctor = require("./doctorschema");
var multer = require("multer");
const Users = require("./userSchema");
const bcrypt = require("bcrypt");
var fs = require("fs");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    async function saveimage() {
      await cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    }
    saveimage();
  }
});

var upload = multer({ storage: storage });
router.post("/add", upload.single("myImage"), function(req, res, next) {
  const saltRounds = 10;
  async function savedata() {
    await bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        let User = new Users({
          email: req.body.email,
          password: hash,
          type: "Doctor"
        });
        User.save((err, obj) => {
          if (err) {
            res.send(err);
          } else {
            const doctor = new Doctor({
              address: req.body.address,
              department: req.body.department,
              designation: req.body.designation,
              DOB: req.body.DOB,
              email: req.body.email,
              firstname: req.body.firstname,
              gender: req.body.gender,
              lastname: req.body.lastname,
              mobile: req.body.mobile,
              password: req.body.password,
              Phone: req.body.Phone,
              specialist: req.body.specialist,
              status: req.body.status,
              image: req.file,
              userid: obj._id,
              joiningDate: Date.now()
            });
            doctor.save((err, doctor) => {
              if (err) {
                res.send(err);
              } else {
                res.send(doctor);
              }
            });
          }
        });
      });
    });
  }
  savedata();
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});
router.post("/delete", (req, res) => {
  let imgDir = "uploads/";
  let doctorid = "";
  async function getone() {
    let docs = await Doctor.findById(req.body.id);
    if (docs) {
      if (docs.image) {
        try {
          fs.statSync(imgDir + docs.image.filename);
          fs.unlinkSync(imgDir + docs.image.filename);
        } catch (e) {
          console.log(e);
        }
      }
      deleteUser();
    } else {
      console.log("no file to unlink");
    }
  }
  async function deleteone() {
    let docid = await Doctor.find({ _id: req.body.id });
    doctorid = docid[0].userid;
    let delt = await Doctor.findById(req.body.id).remove(function(err, result) {
      if (!err) {
        if (result.n > 0) {
          res.send(JSON.stringify({ Data: result, status: "ok" }));
        } else {
          res.send(JSON.stringify({ Data: "Account dosent Exists" }));
        }
      } else {
        res.send(err);
      }
    });
  }
  deleteUser = () => {
    async function dltuser() {
      let query = await Doctor.findById(req.body.id);
      let deltuser = await Users.find({ _id: query.userid }).deleteOne(
        (err, result) => {
          if (!err) {
            deleteone();
          } else {
            deleteone();
          }
        }
      );
    }
    dltuser();
  };

  getone();
});
router.get("/List", (req, res) => {
  async function getDoctors() {
    const docs = await Doctor.find();
    res.send(docs);
  }
  getDoctors();
});

router.get("/findOne", (req, res) => {
  var id = req.query.ID;
  async function getDoctors() {
    try {
      const docs = await Doctor.find({ _id: id }, { password: 0 });
      res.send(docs);
    } catch (e) {
      console.log(e);
    }
  }
  getDoctors();
});
router.post("/update", upload.any(), (req, res) => {
  let imgDir = "uploads/";
  async function getone() {
    let docs = await Doctor.findById(req.body.id);
    if (docs) {
      if (docs.image) {
        try {
          fs.statSync(imgDir + docs.image.filename);
          fs.unlinkSync(imgDir + docs.image.filename);
          return true;
        } catch (e) {
          console.log("err", e);
          return true;
        }
      }
    } else {
      res.send(req.body + " has nothing to do with");
    }
  }
  async function updateData() {
    let doc = await Doctor.findById(req.body.id).exec((err, doc) => {
      if (err) {
        console.log("err", err);
      } else {
        doc.firstname = req.body.firstname;
        doc.lastname = req.body.lastname;
        doc.email = req.body.email;
        doc.status = req.body.status;
        doc.department = req.body.department;
        doc.designation = req.body.designation;
        doc.DOB = req.body.DOB;
        doc.specialist = req.body.specialist;
        doc.mobile = req.body.mobile;
        doc.Phone = req.body.Phone;
        doc.address = req.body.address;
        if (req.files[0]) {
          doc.image = req.files[0];
        } else {
          doc.image = req.body.image;
        }
        doc.save((err, doc) => {
          if (err) {
            res.send(err);
          } else {
            res.send(doc);
          }
        });
      }
    });
  }
  let data = getone();
  if (data) {
    updateData();
  }
});

module.exports = router;
