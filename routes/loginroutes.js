var bcrypt     = require('bcrypt');
var multer     = require('multer');
var db = require('./dbconnect');
var config = require('../config');
const jwt = require('jsonwebtoken');

// db.connect();

exports.register = function(req,res){
  var today = new Date();
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    var users={
      "user_name":req.body.user_name,
      "email":req.body.email,
      "password":hash, 
      "mobile":"", 
      "reg_no":"",
      "degree":"",
      "branch":"",
      "profile_picture":"", 
      "created":today,
      "modified":today
    }
    db.connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
        console.log('The solution is: ', results);

        var email= req.body.email;
        var user_name = req.body.user_name;

        db.connection.query('SELECT id FROM users WHERE email = ?',[email],function (error, results, fields) {
          const user = {
            id: results[0].id,
            username: user_name,
            email: email
          }
          jwt.sign({user},config.secretKey, { expiresIn: 60 * 60 * 60 }, (err, token) => {
            res.send({
              "code":200,
              "status":"signup sucessfull", 
              "response" : {
                "token" : token, 
                "id" : results[0].id
              }
            });
          });
        });
      }
    });
  });
}

exports.login = function(req,resp){
  var email= req.body.email;
  var password = req.body.password;
  console.log("LOGIN CALLLLLLLLLLLLLLLLLLLLLLLLL");
  db.connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    console.error(error)
    resp.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log("RESULTS",email)
    if(results.length >0){
      bcrypt.compare(password, results[0].password, function(err, res) {
        if(res) {
          const user = {
            id: results[0].id,
            username: results[0].user_name,
            email: email
          }
          jwt.sign({user},config.secretKey, { expiresIn: 60 * 60 * 60 }, (err, token) => {
            resp.send({
              "code":200,
              "status":"login sucessfull", 
              "response" : {
                "token" : token, 
                "id" : results[0].id
              }
              });
          });
         
        } else {
          resp.send({
            "code":204,
            "status":"Email and password does not match"
              });
        } 
      });
    }
    else{
      resp.send({
        "code":204,
        "status":"Email does not exits"
          });
    }
  }
  });
}
