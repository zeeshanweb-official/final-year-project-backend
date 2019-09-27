const express = require("express");
const router = express.Router();
const Evets = require("./eventsSchema");

router.post("/add", (req, res) => {
  const evt = new Evets({
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    bgColor: req.body.bgColor,
    resourceId: req.body.resourceId,
    movable: true,
    resizable: true,
    showPopover: true
  });
  evt.save((err, obj) => {
    if (err) {
      res.send(err);
    } else {
      res.send(obj);
    }
  });
});

router.get("/List", (req, res) => {
  async function getevts() {
    const depats = await Evets.find({}, { __v: 0 }).populate("resourceId", {
      password: 0,
      email: 0,
      phone: 0,
      mobile: 0,
      __v: 0
    });
    // res.send(depats);
    depats.map(item => {
      if (new Date() < new Date(item.end)) {
        item.movable = true;
        item.resizable = true;
        item.showPopover = true;
      } else {
        item.movable = false;
        item.resizable = false;
        item.showPopover = false;
        item.bgColor = "#D9D9D9";
      }
    });
    res.send(depats);
  }
  getevts();
});
router.post("/update", (req, res) => {
  async function getevts() {
    const depats = await Evets.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          title: req.body.title,
          bgColor: req.body.bgColor,
          start: req.body.start,
          end: req.body.end,
          extrainfo: {
            update: true
          },
          resourceId: req.body.resourceId
        }
      },
      { new: true }
    );
    res.send(depats);
  }
  getevts();
});
router.post("/updatestartend", (req, res) => {
  async function getevts() {
    const depats = await Evets.findOneAndUpdate(
      { _id: req.body.event.id },
      {
        $set: {
          start:
            req.body.dir === "start" ? req.body.point : req.body.event.start,
          end: req.body.dir === "end" ? req.body.point : req.body.event.end
        }
      },
      { new: true }
    );
    res.send(depats);
  }
  getevts();
});
router.post("/fullUpdate", (req, res) => {
  async function getevts() {
    const depats = await Evets.findOneAndUpdate(
      { _id: req.body.event.id },
      {
        $set: {
          start: req.body.start,
          end: req.body.end,
          resourceId: req.body.slotId
        }
      },
      { new: true }
    );
    res.send(depats);
  }
  getevts();
});
router.post("/remove", (req, res) => {
  async function getevts() {
    const depats = await Evets.findByIdAndRemove(req.body.id, (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    });
  }
  getevts();
});
module.exports = router;
