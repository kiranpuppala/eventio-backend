
var db = require('./dbconnect');
var config = require('../config');
const jwt = require('jsonwebtoken');

exports.createEvent = function (req, res) {
  db.connection.query("INSERT INTO events SET ?", req.body, function (error, results, fields) {
    if (error) {
      console.log("error ocurred", error);
      res.send({ 
        "code": 400,
        "status": "",
        "response": {}
      })
    } else {
      console.log('The solution is: ', results);
      res.send({
        "code": 200,
        "status": "",
        "response": {}
      });
    }
  });

}

exports.updateEvent = function (req, res) {

  var id = req.body.id;
  delete req.body.id;

  var query = "UPDATE events SET ? WHERE id=" + id;

  db.connection.query(query, req.body, function (error, results, fields) {
    if (error) {
      console.log("error ocurred", error);
      res.send({
        "code": 400,
        "status": "",
        "response": {}
      })
    } else {
      console.log('The solution is: ', results);
      res.send({
        "code": 200,
        "status": "",
        "response": {}
      });
    }
  });

}

exports.joinEvent = function (req, res) {
  var id = req.body.id;
  delete req.body.id;
  
  var query = "SELECT joinees FROM events WHERE id="+id;

  db.connection.query(query,function(error,results,fields){
    if(!error){
      var joinees = [];
      if(results.length>0){
        console.log("RESULts",results[0].joinees)
        try{
          joinees = JSON.parse(results[0].joinees);
        }catch(e){
          console.log(e);
        }
      }

      if(joinees.includes(req.body.email)===false)
        joinees.push(req.body.email);
  
      db.connection.query("UPDATE events SET joinees='"+JSON.stringify(joinees)+"' WHERE id="+id,function(error,results,fields){
        if(!error){
          console.log("RESULTS",results[0])
          res.send({
            "code" : 200, 
            "status" : "", 
            "response" : {}
          })
        }
      });
    }
  });
}


exports.listEvents = function (req, res) {
  console.log("REQUEST", req);
  var query;
  if (typeof req.body.email != "undefined")
    query = "SELECT * FROM events WHERE email ='" + req.body.email + "'";
  else
    query = "SELECT * FROM events";

  db.connection.query(query, function (error, results, fields) {
    if (error) {
      console.log("error ocurred", error);
      res.send({
        "code": 400,
        "status": "",
        "response": {}
      })
    } else {
      console.log('The solution is: ', results);
      res.send({
        "code": 200,
        "status": "",
        "response": results
      });
    }
  });
}

