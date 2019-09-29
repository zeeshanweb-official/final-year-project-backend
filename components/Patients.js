const express = require("express");
const router = express.Router();
const Patient = require("./PatientsScehma");
const fs = require("fs");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/patients");
  },
  filename: function(req, file, cb) {
    async function saveimage() {
      await cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    }
    saveimage();
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File format should be PNG,JPG,JPEG"), false); // if validation failed then generate error
  }
};

var upload = multer({ storage: storage, fileFilter: fileFilter });
router.post("/add", upload.single("myImage"), function(req, res, next) {
  const str = req.body.refferedTo;
  const newstr = str.slice(str.indexOf("(") + 1, -1);
  const patient = new Patient({
    address: req.body.address,
    age: req.body.age,
    firstname: req.body.firstname,
    gender: req.body.gender,
    lastname: req.body.lastname,
    mobile: req.body.mobile,
    Phone: req.body.Phone,
    medicines: req.body.medicines,
    disease: req.body.disease,
    refferedTo: newstr,
    cnic: req.body.cnic,
    image: req.file
  });
  patient.save((err, obj) => {
    if (err) {
      res.send(err);
    } else {
      res.send(obj);
    }
  });
});

router.get("/List", (req, res) => {
  async function getDoctors() {
    const docs = await Patient.find({})
      .populate("refferedTo", {
        password: 0,
        email: 0,
        phone: 0,
        mobile: 0,
        _id: 0
      })
      .exec((err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
  }
  getDoctors();
});
router.post("/patientswithdocs", (req, res) => {
  async function getDoctors() {
    const docs = await Patient.find({}).exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        async function newdocs(params) {
          let docs = [];
          await result.map(item => {
            if (item.extraFiles.length>0) {
              docs.push(item);
            }
          });
          res.send(docs);
        }
        newdocs();
      }
    });
  }
  getDoctors();
});
router.post("/lookforon", upload.single("myImage"), function(req, res, next) {
  async function getDoctors() {
    const docs = await Patient.find({
      $or: [
        { firstname: { $regex: `^${req.body.name}.*`, $options: "si" } },
        { lastname: { $regex: `^${req.body.name}.*`, $options: "si" } }
      ]
    }).exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
  if (req.body.name != "") {
    getDoctors();
  }
});
router.post("/UploadLabDocs", upload.any(), function(req, res, next) {
  async function getDoctors() {
    Patient.findOneAndUpdate(
      { _id: req.body.id },
      { $push: { extraFiles: { labDocs: req.files[0].filename } } },
      { new: true },
      (err, doc) => {
        if (err) {
          res.send("Something wrong when updating data!" + err);
        } else {
          res.send(doc);
        }
      }
    );
  }
  getDoctors();
});
router.get("/details", (req, res) => {
  var id = req.query.ID;
  async function getDoctors() {
    try {
      const docs = await Patient.find({ _id: id }).populate("refferedTo", {
        password: 0,
        email: 0,
        phone: 0,
        mobile: 0
      });
      res.send(docs);
    } catch (e) {
      console.log(e);
    }
  }
  getDoctors();
});
router.post("/update", (req, res) => {
  let newstr = "";
  if (req.body.refferedto) {
    const str = req.body.refferedto;
    newstr = str.slice(str.indexOf("(") + 1, -1);
  }
  async function updateData() {
    let doc = await Patient.findById(req.body._id).exec((err, doc) => {
      if (err) {
        console.log("err", err);
      } else {
        doc.firstname = req.body.firstname;
        doc.lastname = req.body.lastname;
        doc.age = req.body.age;
        doc.cnic = req.body.cnic;
        doc.mobile = req.body.mobile;
        doc.address = req.body.address;
        doc.refferedTo = req.body.refferedTo
          ? newstr
          : "5d8a645f672afa3950c0e768";
        doc.medicines = req.body.medicines;
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
  updateData();
});
router.post("/updatepic", (req, res) => {
  console.log(req.body);
  console.log(req.files);
});
router.post("/delete", (req, res) => {
  let imgDir = "uploads/patients";
  async function getone() {
    let docs = await Patient.findById(req.body.id);
    if (docs) {
      if (docs.image) {
        try {
          fs.statSync(imgDir + docs.image.filename);
          fs.unlinkSync(imgDir + docs.image.filename);
        } catch (e) {
          console.log(e);
        }
      }
      deleteone();
    } else {
      console.log("no file to unlink");
    }
  }
  async function deleteone() {
    let delt = await Patient.findById(req.body.id).remove(function(
      err,
      result
    ) {
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

  getone();
});
router.post("/DeleteLabDocs", (req, res) => {
  async function deletePics() {
    Patient.findOneAndUpdate(
      { _id: req.body.patient },
      { $pull: { extraFiles: req.body.file } },
      { new: true },
      (err, doc) => {
        if (err) {
          res.send("Something wrong when updating data!" + err);
        } else {
          res.send(doc);
        }
      }
    );
  }
  deletePics();
});
module.exports = router;
