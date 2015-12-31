/**
 * Created by dentorfs_ on 22/11/15.
 */
var mysql = require('mysql');

var connectionpool = mysql.createPool({
    /* host     : process.env.OPENSHIFT_EXTMYSQL_DB_HOST,
     user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
     password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
     port     :  process.env.OPENSHIFT_MYSQL_DB_PORT,
     database : 'php'*/
    host    : '127.0.0.1',
    user     : 'root',
    port    : 3306,
    password : '3Ast:ak25',
    database : 'GLOBE_CONNECT',
    connectionLimit : 151

});

module.exports = connectionpool;
