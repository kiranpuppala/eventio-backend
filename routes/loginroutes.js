var bcrypt     = require('bcrypt');
var multer     = require('multer');
var db = require('./dbconnect');


db.connect();

exports.register = function(req,res){
  var today = new Date();
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    var users={
      "first_name":req.body.first_name,
      "last_name":req.body.last_name,
      "email":req.body.email,
      "password":hash, 
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
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
    }
    });
  });
}

exports.login = function(req,resp){
  var email= req.body.email;
  var password = req.body.password;
  db.connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
  if (error) {
    resp.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    if(results.length >0){
      bcrypt.compare(password, results[0].password, function(err, res) {
        if(res) {
         resp.send({
            "code":200,
            "success":"login sucessfull"
            });
        } else {
          resp.send({
            "code":204,
            "success":"Email and password does not match"
              });
        } 
      });
    }
    else{
      resp.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
  }
  });
}
