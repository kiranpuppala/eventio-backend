
var db = require('./dbconnect');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('../config');
var responses = require('../utils/responses.js');

// db.connect();

exports.editProfile = function (req, res) {
  var id = req.body.user_id;
  delete req.body.user_id;

  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (!err) {
      if (req.body.password != "") {
        req.body.password = hash;
        var query = "UPDATE users SET ? WHERE id=" + id;
        db.connection.query(query, req.body, function (error, results, fields) {
          if (error) {
            console.log("error ocurred", error);
            res.send({
              "code": 400,
              "failed": "error ocurred"
            })
          } else {
            console.log('The solution is: ', results);
            res.send({
              "code": 200,
              "success": "profile updated"
            });
          }
        });
      }else{
        res.send(responses.error400);
      }
    }else{
      res.send(responses.error400);
    }
  });

}


exports.getProfile = function (req, res) {
  console.log("GET PROFILE", req.query.user_id)
  db.connection.query("SELECT id,profile_picture,user_name,reg_no,degree,branch,email,mobile FROM users WHERE id= '" + req.query.user_id + "'", function (error, results, fields) {
    console.log("RESULTS", results[0]);
    if (error) {
      console.log("error ocurred", error);
      res.send({
        "code": 400,
        "status": "error ocurred",
        "response": error
      })
    } else {
      console.log('The solution is: ', results[0]);
      res.send({
        "code": 200,
        "status": "success",
        "response": results[0]
      });
    }
  });
}