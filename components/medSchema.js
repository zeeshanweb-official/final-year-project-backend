var mongoose = require("mongoose");
var Types = require("mongoose-easy-types").Types;

var Schema = mongoose.Schema;
var medSchema = new Schema({
  name: { type: String, unique: true },
  for: String,
  quantity: Number
});

module.exports = mongoose.model("Medicine", medSchema);
