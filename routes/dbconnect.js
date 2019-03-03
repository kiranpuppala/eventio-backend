var mysql      = require('mysql');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'eventapp'
});

exports.connection = connection;

// exports.connect = function(){
//   connection.connect(function(err){
//     if(!err) {
//         console.log("Database is connected");
//     } else {
//         console.log("Error connecting database",err);
//     }
//     });
// }
