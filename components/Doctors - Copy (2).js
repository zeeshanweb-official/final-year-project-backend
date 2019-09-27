const express = require("express");
const router = express.Router();
const Doctor = require('./doctorschema');
const fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

router.post('/add', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.file)
    console.log(req.body)
  })
router.post('/adds', (req,res)=>{
    const doctor = new Doctor({
        address:req.body.address,
        department:req.body.department,
        DOB:req.body.DOB,
        email:req.body.email,
        firstname:req.body.firstname,
        gender:req.body.gender,
        lastname:req.body.lastname,
        mobile:req.body.mobile,
        password:req.body.password,
        Phone:req.body.Phone,
        specialist:req.body.specialist,
        status:req.body.status,
})
    doctor.save((err,obj)=>{
        if(err){
            res.send(err)
        }
        else{
            res.send(obj)
        }
    });
})

router.get('/List',(req,res)=>{
    async function getDoctors(){
        const docs = await Doctor.find();
        res.send(docs)
    }
    getDoctors()
})

// router.post("/makeAd", (req, res) => {

//     var form = new formidable.IncomingForm();
//     form.encoding = 'utf-8';
//     form.uploadDir = "uploads/ads";
//     form.keepExtensions = true;
//     form.type = 'multipart';
//     form.maxFields = 100;
//     form.maxFileSize = 10 * 1024 * 1024; //10 mb max filesize
//     form.maxFieldsSize = 10 * 1024 * 1024;
//     form.multiples = true;

//     form.parse(req, (err, fields, files) => {
//         var files2 = Object.values(files);
//         var imagename = [];

//         files2.map((image, i) => {

//             var path = files2[i].path;
//             path = path.split('\\').join('/');
//             imagename[i] = path.split('/')[2];
//         })
//         var ad = new Ad();
//         ad.name = fields.title;
//         ad.category = fields.category;
//         ad.city = fields.city;
//         ad.price = fields.price;
//         ad.about = fields.about;
//         ad.userID = fields.userID;
//         ad.image1 = imagename[0];
//         ad.image2 = imagename[1];
//         ad.image3 = imagename[2];
//         ad.negotiable = fields.negotiable;
//         ad.PostDate = new Date;
//         ad.save(function (err, result) {
//             if (err) {
//                 res.json({ status: err })
//             }
//             else {
//                 res.json({ status: 'ok', result: result });
//             }
//         });
//     });

// });
// router.post('/getads', (req, res) => {
//     let query = Ad.find({});
//     query.populate('userID');
//     query.exec((err, result) => {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send(result);
//         }
//     });
// })
// router.post('/getperonalads', (req, res) => {
//     Ad.find({ 'userID': req.body.data }, function (err, ads) {
//         if (ads.length > 0) {
//             res.send(JSON.stringify({ Data: ads }));
//         }
//         else {
//             res.send('Not Found');
//         }
//     })
// })
// router.post('/deleteAds', (req, res) => {
//     let query = Ad.findById(req.body.data);
//     query.exec()
//         .then(function (err, ad) {
//             if (!err) {
//                 var filenames = [];
//                 let imgDir = 'uploads/ads/'
//                 if (err) {
//                     res.send(err)
//                 } else {
//                     filenames[0] = ad.image1;
//                     filenames[1] = ad.image2;
//                     filenames[2] = ad.image3;
//                     filenames.map((image, i) => {
//                         try {
//                             fs.statSync(imgDir + image);
//                             fs.unlinkSync(imgDir + image);
//                         }
//                         catch (e) {
//                             console.log(e);
//                         }
//                     })

//                 }
//             }

//         }).then(() => {
//             Ad.findById(req.body.data).remove(function (err, result) {
//                 if (result.n > 0) {

//                     res.send(JSON.stringify({ Data: result, status: 'ok' }));
//                 } else {
//                     res.send(JSON.stringify({ Data: 'Ad dosent Exists' }))
//                 }
//                 ;
//             })
//         })

// })
// router.post('/verify_ad', (req, res) => {
//     let query = Ad.findById(req.body.id);
//     query.exec(function (err, ad) {
//         if (err) {
//             res.send(err)
//         } else {
//             res.send(ad._id);
//         }
//     })
// })

// router.post('/edit_ad', (req, res) => {
//     let query = Ad.findById(req.body.id);
//     query.exec(function (err, ad) {
//         if (err) {
//             res.send(err)
//         } else {
//             res.send(ad)
//         }
//     })
// })
// router.post('/update_ad', (req, res) => {
//     var form = new formidable.IncomingForm();
//     form.encoding = 'utf-8';
//     form.uploadDir = "uploads/ads";
//     form.keepExtensions = true;
//     form.type = 'multipart';
//     form.maxFields = 100;
//     form.maxFileSize = 10 * 1024 * 1024; //10 mb max filesize
//     form.maxFieldsSize = 10 * 1024 * 1024;
//     form.multiples = true;

//     form.parse(req, (err, fields, files) => {
//         var files2 = Object.values(files);
//         var imagename = [];

//         files2.map((image, i) => {

//             var path = files2[i].path;
//             path = path.split('\\').join('/');
//             imagename[i] = path.split('/')[2];
//         })
//         // let query = Ad.findById(req.body.id);
//         // query.exec(function (err, ad) {
//         //     if (err) {
//         //         res.send(err)
//         //     } else {
//         //         res.send(ad)
//         //     }
//     })
// })
// router.post('/single_ad_details/:adid', (req, res) => {
//     var id = req.params.adid;
//     let query = Ad.findById(id);
//     query.populate('userID');
//     query.exec().then((ad) => {
//         res.send(ad);
//     })
// })
// router.post('/adtofvrt', (req, res) => {
//     var user = req.body.user;
//     var id = req.body.id;
//     // let query=Favourits.find({userID:user,AdId:id})
//     // query.exec().then((err,fvrts)=>{
//     //     console.log(fvrts)
//     // })
//     var favourit = new Favourits();
//     favourit.userID = user;
//     favourit.AdId = id;
//     favourit.save((err, success) => {
//         if (!err) {
//             res.send(success);
//         } else {
//             res.send(err);
//         }
//     })
// })
// router.post('/favourits/:userid', (req, res) => {
//     var id = req.params.userid;
//     let query = Favourits.find({ userID: id });
//     query.populate('userID');
//     query.populate('AdId');
//     query.exec().then((favourits) => {
//         res.send(favourits);
//     })
// })
// router.post('/deletefavourits/:id', (req, res) => {
//     var id = req.params.id;
//     let query = Favourits.findByIdAndRemove(id);
//     query.exec().then((results)=>{
//         res.send(results);
//     })
// })
// router.post('/categorizedAds/:category', (req, res) => {
//     var category = req.params.category;
//     var query=Ad.find({"category":category});
//     query.exec().then((ads)=>{
//         res.send(ads);
//     })
// })
// router.post('/searchAds', (req, res) => {
//     let category=req.body.search.category;
//     let keyword=req.body.search.keywords;
//     if(category!==''){
//         let query=Ad.find({'category':category,'name': new RegExp(keyword, 'i')} )
//         query.exec().then((Ads)=>{
//             res.send(Ads);
//         })
//     }
//     else{
//         let query2=Ad.find({'name': new RegExp(keyword, 'i')})
//         query2.exec().then((Ads)=>{
//             res.send(Ads);
//         })
//     }
// })

module.exports = router;
