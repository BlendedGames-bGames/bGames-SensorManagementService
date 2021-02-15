const mysql = require('mysql');
var mysqlConnection  = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host:'bgames-MysqlDB',
    port:'3306',
    user:'foo',
    password:'Bnx69t304857@.@',
    database: 'blended_games',
    multipleStatements:true
});
module.exports = mysqlConnection;