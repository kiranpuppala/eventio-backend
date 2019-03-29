var bcrypt = require('bcrypt');
var multer = require('multer');
var db = require('./dbconnect');
var config = require('../config');
const jwt = require('jsonwebtoken');
const responses = require('../utils/responses');

var createTables = function(){
  var sql1 = "CREATE TABLE IF NOT EXISTS users" +
  "(id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, user_name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL,"+
  "password VARCHAR(255) NOT NULL, mobile VARCHAR(20) NOT NULL, reg_no VARCHAR(30) NOT NULL,"+
  "degree VARCHAR(50) NOT NULL, branch VARCHAR(50) NOT NULL, profile_picture VARCHAR(255) NOT NULL,"+
  "created VARCHAR(50) NOT NULL, modified VARCHAR(50) NOT NULL)";

  db.connection.query(sql1, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  var sql2 = "CREATE TABLE IF NOT EXISTS events" +
  "(id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, graphic VARCHAR(255) NOT NULL, name VARCHAR(100) NOT NULL,"+
  "description VARCHAR(500) NOT NULL, category VARCHAR(50) NOT NULL, to_date VARCHAR(50) NOT NULL,"+
  "from_date VARCHAR(50) NOT NULL, to_time VARCHAR(50) NOT NULL, from_time VARCHAR(50) NOT NULL,"+
  "venue VARCHAR(500) NOT NULL, coordinators VARCHAR(255) NOT NULL, mobile VARCHAR(50) NOT NULL,"+
  "email VARCHAR(50) NOT NULL, joinees VARCHAR(1000) NOT NULL)";


  db.connection.query(sql2, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
}

exports.register = function (req, res) {
  var today = new Date();
  createTables();
  
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    var users = {
      "user_name": req.body.user_name,
      "email": req.body.email,
      "password": hash,
      "mobile": "",
      "reg_no": "",
      "degree": "",
      "branch": "",
      "profile_picture": "",
      "created": today,
      "modified": today
    }

    db.connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
      if (error) {
        console.log("ERROR",error)
        res.send(responses.errInternalServer);
      } else {
        var email = req.body.email;
        var user_name = req.body.user_name;

        db.connection.query('SELECT id FROM users WHERE email = ?', [email], function (error, results, fields) {
          const user = {
            id: results[0].id,
            username: user_name,
            email: email
          }
          jwt.sign({ user }, config.secretKey, { expiresIn: 60 * 60 * 60 }, (err, token) => {
            res.send({
              "code": 200,
              "status": "signup sucessful",
              "response": {
                "token": token,
                "id": results[0].id
              }
            });
          });
        });
      }
    });
  });
}

exports.login = function (req, resp) {
  var email = req.body.email;
  var password = req.body.password;
  db.connection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      resp.send(responses.errInternalServer);
    } else {
      console.log("RESULTS", email)
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, function (err, res) {
          if (res) {
            const user = {
              id: results[0].id,
              username: results[0].user_name,
              email: email
            }
            jwt.sign({ user }, config.secretKey, { expiresIn: 60 * 60 * 60 }, (err, token) => {
              resp.send({
                "code": 200,
                "status": "login sucessfull",
                "response": {
                  "token": token,
                  "id": results[0].id
                }
              });
            });

          } else {
            resp.send(responses.errorUnauth);
          }
        });
      } else {
        resp.send(responses.errorUnauth);
      }
    }
  });
}
