const express = require("express");
const router = express.Router();
const Department = require("./DepartmentSchema");
router.post("/add", (req, res) => {
  const department = new Department({
    Name: req.body.depName,
    description: req.body.desc,
    HODName: req.body.HODName,
    status: req.body.status
  });
  department.save((err, obj) => {
    if (err) {
      res.send(err);
    } else {
      res.send(obj);
    }
  });
});

router.get("/List", (req, res) => {
  async function getDeparts() {
    const depats = await Department.find();
    res.send(depats);
  }
  getDeparts();
});
router.post("/delete", (req, res) => {
  async function deleteone() {
    let delt = await Department.findById(req.body.id).remove(function(
      err,
      result
    ) {
      if (!err) {
        if (result.n > 0) {
          res.send(JSON.stringify({ Data: result, status: "ok" }));
        } else {
          res.send(JSON.stringify({ Data: "Department dosent Exists" }));
        }
      } else {
        res.send(err);
      }
    });
  }
  deleteone();
});
module.exports = router;
