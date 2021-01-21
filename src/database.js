const mysql = require('mysql');
var mysqlConnection  = mysql.createPool({
    connectionLimit : 100,
    host:'db4free.net',
    user:'grybyus',
    password:'interaction1',
    database: 'testbg',
    multipleStatements:true
});
  
mysqlConnection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
module.exports = mysqlConnection;