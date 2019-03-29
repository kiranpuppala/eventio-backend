var db = require('./dbconnect');
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

exports.createEvent = function (req, res) {
  createTables();
  db.connection.query("INSERT INTO events SET ?", req.body, function (error, results, fields) {
    if (error) {
      console.log("ERRR",error)
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
      console.log("UD",error)
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


exports.manageEvents = function (req, res) {
  var query = "SELECT * FROM events";
  var email = req.body.email;

  db.connection.query(query, function (error, results, fields) {
    if (error) {
      res.send(responses.errInternalServer);
    } else {
      var output = [];
      for(var i in results){
        try{
          if(results[i]["coordinators"].includes(email))
            output.push(results[i]);
        }catch(e){
          console.log("Exception",e);
        }
      }
      res.send({
        "code": 200,
        "status": "",
        "response": output
      });
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

