var db = require('./dbconnect');
const responses = require('../utils/responses');

exports.createEvent = function (req, res) {
  db.connection.query("INSERT INTO events SET ?", req.body, function (error, results, fields) {
    if (error) {
      res.send(responses.errInternalServer);
    } else {
      res.send({
        "code": 201,
        "status": "created",
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
      res.send(responses.errInternalServer);
    } else {
      res.send({
        "code": 200,
        "status": "updated",
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
          res.send({
            "code" : 200, 
            "status" : "Joined Successfully", 
            "response" : {}
          })
        }else{
          res.send(responses.errInternalServer);
        }
      });
    }else{
      res.send(responses.errInternalServer);
    }
  });
}


exports.listEvents = function (req, res) {
  var query;
  if (typeof req.body.email != "undefined")
    query = "SELECT * FROM events WHERE email ='" + req.body.email + "'";
  else
    query = "SELECT * FROM events";

  db.connection.query(query, function (error, results, fields) {
    if (error) {
      res.send(responses.errInternalServer);
    } else {
      res.send({
        "code": 200,
        "status": "",
        "response": results
      });
    }
  });
}

