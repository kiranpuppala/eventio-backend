var db = require('./dbconnect');
var bcrypt = require('bcrypt');
var responses = require('../utils/responses');


exports.editProfile = function (req, res) {
  var id = req.body.user_id;
  delete req.body.user_id;

  if (req.body.password == ""){
    delete req.body.password
    updateProfile();
  }else{
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      if (!err) {
        req.body.password = hash;
        updateProfile()
      } else {
        res.send(responses.errorBadReq);
      }
    });
  }

  function updateProfile(){
    var query = "UPDATE users SET ? WHERE id=" + id;
    db.connection.query(query, req.body, function (error, results, fields) {
      if (error) {
        res.send(responses.errInternalServer);
      } else {
        res.send({
          "code": 200,
          "status": "profile updated",
          "response": {}
        });
      }
    });
  }
}


exports.getProfile = function (req, res) {
  db.connection.query("SELECT id,profile_picture,user_name,reg_no,degree,branch,email,mobile FROM users WHERE id= '" + req.query.user_id + "'", function (error, results, fields) {
    if (error) {
      res.send(responses.errInternalServer);
    } else {
      res.send({
        "code": 200,
        "status": "success",
        "response": results.length>0?results[0]:{}
      });
    }
  });
}

exports.getPublicProfile = function (req, res) {
  db.connection.query("SELECT id,profile_picture,user_name,reg_no,degree,branch,email,mobile FROM users WHERE email= '" + req.query.email + "'", function (error, results, fields) {
    if (error) {
      console.log("RESPONSE",error)
      res.send(responses.errInternalServer);
    } else {
      console.log("RESPONSE",results)

        res.send({
        "code": 200,
        "status": "success",
        "response": results.length>0?results[0]:{}
      });
    }
  });
}