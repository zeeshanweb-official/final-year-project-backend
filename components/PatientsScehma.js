var mongoose = require("mongoose");
var Types = require("mongoose-easy-types").Types;

var Schema = mongoose.Schema;
var PatientsSchema = new Schema({
  firstname: String,
  lastname: String,
  gender: String,
  address: String,
  phone: String,
  mobile: String,
  age: String,
  medicines: Array,
  disease: String,
  cnic: String,
  refferedTo: {
    type: Schema.Types.ObjectId,
    ref: "Doctor"
  },
  extraFiles: Array
});
module.exports = mongoose.model("Patients", PatientsSchema);
