
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'images')   
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)      
  }
})

var upload = multer({ storage: storage }).array("imgUploader", 1);

exports.editProfile = function(req,res){
  upload(req, res, function (err) {
    if (err) {
        console.log("error uploading image",err)
    }
        console.log("File uploaded sucessfully!");
    });  

    // var users={
    //     "first_name":req.body.first_name,
    //     "last_name":req.body.last_name,
    //     "email":req.body.email,
    //     "password":hash, 
    //     "created":today,
    //     "modified":today
    //   }

}

