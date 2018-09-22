var mysql = require('./../util/mysqlhandler');



var result = mysql.select("SELECT * FROM Player",[]);

console.log(result);
