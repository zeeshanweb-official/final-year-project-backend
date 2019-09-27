var mongoose = require("mongoose");
var Types = require("mongoose-easy-types").Types;

var Schema = mongoose.Schema;
var userSchema = new Schema({
  Date: Date,
  email: Types.internet.email({ required: true }),
  password: String,
  type: String
});

module.exports = mongoose.model("User", userSchema);
