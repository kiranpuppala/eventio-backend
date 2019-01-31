
var db = require('./dbconnect');
var config = require('../config');
const jwt = require('jsonwebtoken');

db.connect();

exports.createEvent = function(req,res){
    var users={
        "graphic" : req.body.graphic,
        "name" : req.body.name,
        "description":req.body.description,
        "tags":req.body.tags,
        "from_date":req.body.from_date,
        "to_date":req.body.to_date, 
        "from_time":req.body.from_time,
        "to_time":req.body.to_time, 
        "venue":req.body.venue,
        "coordintators":req.body.coordintators, 
        "mobile":req.body.mobile, 
        "email":req.body.email
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

