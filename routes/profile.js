
var db = require('./dbconnect');
const jwt = require('jsonwebtoken');
var config = require('../config');

db.connect();

exports.editProfile = function(req,res){
    var users={
        "first_name" : req.body.first_name,
        "last_name" : req.body.last_name,
        "profile_picture":req.body.profile_picture,
        "reg_no":req.body.reg_no,
        "degree":req.body.degree, 
        "branch":req.body.branch,
        "mobile":req.body.mobile
      }
      console.log("USERS",users);
      db.connection.query("UPDATE users SET ? WHERE email= '"+req.body.ref_id+"'", users,function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        }else{
          console.log('The solution is: ', results);
          res.send({
            "code":200,
            "success":"user registered sucessfully"
              });
        }
        });

}


exports.getProfile = function(req,res){
      db.connection.query("SELECT profile_picture,first_name,last_name,reg_no,degree,branch,email,mobile FROM users WHERE email= '"+req.body.ref_id+"'",function (error, results, fields) {
        console.log("RESULTS",results[0]);
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "code":400,
            "status":"error ocurred",
            "response":error
          })
        }else{
          console.log('The solution is: ', results);
          res.send({
            "code":200,
            "status":"success", 
            "response": results[0]
              });
        }
        });
}