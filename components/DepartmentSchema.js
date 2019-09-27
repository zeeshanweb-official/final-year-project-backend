var mongoose = require("mongoose");
const DeptSchema = new mongoose.Schema({
    Name:String,
    description:String,
    HODName:String,
    status:String,
})
module.exports =mongoose.model('department', DeptSchema);