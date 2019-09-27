const express = require("express");
const router = express.Router();
const Department = require('./DepartmentSchema');
router.post('/add', (req,res)=>{
    const department = new Department({
        Name:req.body.depName,
        description:req.body.desc,
        HODName:req.body.HODName,
        status:req.body.status
    })
    department.save((err,obj)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(obj)
        }
    });
})

router.get('/List',(req,res)=>{
    async function getDeparts(){
        const depats = await Department.find();
        res.send(depats)
    }
    getDeparts()
})
module.exports = router;
