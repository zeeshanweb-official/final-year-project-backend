const express = require("express");
const router = express.Router();
const Medicine = require("./medSchema");
router.post("/add", (req, res) => {
  let med = new Medicine({
    name: req.body.medname,
    for: req.body.medfor,
    quantity: req.body.quantity
  });
  med.save((err, obj) => {
    if (err) {
      res.send(err);
    } else {
      res.send(obj);
    }
  });
});
router.get("/list", (req, res) => {
  async function getDoctors() {
    const docs = await Medicine.find({}).exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
  getDoctors();
});
module.exports = router;
