var db = require('./dbconnect');
var bcrypt = require('bcrypt');
var responses = require('../utils/responses');


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
            res.send(responses.errInternalServer);
          } else {
            res.send({
              "code": 200,
              "status": "profile updated", 
              "response": {}
            });
          }
        });
      }else{
        res.send(responses.errorBadReq);
      }
    }else{
      res.send(responses.errorBadReq);
    }
  });

}


exports.getProfile = function (req, res) {
  db.connection.query("SELECT id,profile_picture,user_name,reg_no,degree,branch,email,mobile FROM users WHERE id= '" + req.query.user_id + "'", function (error, results, fields) {
    if (error) {
      res.send(responses.errInternalServer);
    } else {
      res.send({
        "code": 200,
        "status": "success",
        "response": results[0]
      });
    }
  });
}