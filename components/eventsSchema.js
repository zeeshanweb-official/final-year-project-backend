var mongoose = require("mongoose");
var Types = require("mongoose-easy-types").Types;
var Schema = mongoose.Schema;
const EventSchema = new Schema({
  title: String,
  bgColor: String,
  start: String,
  end: String,
  extrainfo: Object,
  movable: Boolean,
  resizable: Boolean,
  showPopover: Boolean,
  resourceId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor"
  }
});
module.exports = mongoose.model("evt", EventSchema);
