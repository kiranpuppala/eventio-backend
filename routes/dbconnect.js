var mysql      = require('mysql');


var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'n1pKZ9NfuF',
  password : 'UjBRUGRjDB',
  database : 'n1pKZ9NfuF', 
  port : 3306
});




exports.connection = connection;
