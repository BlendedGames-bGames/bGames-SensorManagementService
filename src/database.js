const mysql = require('mysql');
var mysqlConnection  = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host:'db4free.net',
    user:'grybyus',
    password:'interaction1',
    database: 'testbg',
    multipleStatements:true
});
module.exports = mysqlConnection;