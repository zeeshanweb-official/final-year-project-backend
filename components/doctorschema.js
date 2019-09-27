var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const DoctorSchema = new Schema({
  address: String,
  department: String,
  designation: String,
  DOB: Date,
  email: String,
  firstname: String,
  gender: String,
  image: Object,
  lastname: String,
  mobile: String,
  password: String,
  Phone: String,
  specialist: String,
  status: String,
  joiningDate: Date,
  featuredimage: Object,
  userid: String
});

module.exports = mongoose.model("Doctor", DoctorSchema);
