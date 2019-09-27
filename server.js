var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var eSession = require("express-session");
var mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/olxPakistan');
var multer = require('multer')
var users = require('./serverfiles/user')
var Ads = require('./serverfiles/Ads')
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    }
});
var upload = multer({ storage: storage }).single('image');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(eSession({
    secret: "We have your details",
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/image/:imgName', function (req, res) {
    let imgDir = 'uploads/';
    try {
        fs.statSync(imgDir + req.params.imgName);
        res.sendFile(imgDir + req.params.imgName, { "root": __dirname });
    }
    catch (e) {
        res.sendFile(imgDir + 'default.jpg', { "root": __dirname });
    }

    // console;
})
app.get('/ads/:imgName', function (req, res) {
    let imgDir = 'uploads/ads/';

    try {
        fs.statSync(imgDir + req.params.imgName);
        res.sendFile(imgDir + req.params.imgName, { "root": __dirname });
    } catch (e) {
        res.sendFile(imgDir + 'default.jpg', { "root": __dirname });
    }

})

app.use('/users', users)
app.use('/ads', Ads)

var Schema = mongoose.Schema;

// Compile model from schema
// var User = mongoose.model('User', UserSchema);

app.post('/cart', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            // An error occurred when uploading
        }
        else {
            console.log('file uploaded successfully')
        }
        // Everything went fine
    })

})
app.use(express.static('./sbf18/build'));
const port = 9962;
app.listen(port, console.log("Listening on port " + port));