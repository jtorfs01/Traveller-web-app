var express = require('express');
var mysql = require('mysql');
var bodyParser;
bodyParser = require('body-parser');
var router = express.Router();
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*connectionpool = mysql.createPool({
    host     : process.env.OPENSHIFT_EXTMYSQL_DB_HOST,
    user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
    password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
    port     :  process.env.OPENSHIFT_MYSQL_DB_PORT,
    database : 'php'
});*/

var connectionpool = mysql.createPool({
    /*  host     : process.env.OPENSHIFT_EXTMYSQL_DB_HOST,
     user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
     password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
     port     :  process.env.OPENSHIFT_MYSQL_DB_PORT,
     database : 'php'*/
    host    : '127.0.0.1',
    user     : 'root',
    port    : 3306,
    password : '3Ast:ak25',
    database : 'GLOBE_CONNECT'
});
console.log(connectionpool);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Traveller' });
});

/* GET signup page. */
router.get('/singup', function(req, res, next) {
  res.render('singup', { title: 'Sing-up' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});



// GET Login info and long user in.
router.post('/getAccount', function(req,res,next){
    var username = req.body.userName;
    var password=  req.body.password;
    console.log("GetAccount openend");
   // res.render('index', { title:  connection.escape(req.body.userName) });
    connectionpool.getConnection(function(err, connection) {
    console.log('Trying to connect');
    if (!err) {
        console.log('Trying to execute query now'),
            connectionpool.query('SELECT * FROM LOGIN WHERE USERNAME ='   + connection.escape(req.body.userName),
               // function (err, rows, fields) {
                function (err, rows) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.send({
                            result: 'error',
                            err: err.code
                        });
                        console.log('It doesnt work error 500');
                    }
                    res.send({
                        result: 'success',
                        err: '',
                     //   fields: fields,
                        json: rows,
                        length: rows.length,

                    });
                    console.log(rows.length);
                  /*  for (var i=0; i<=rows.length; i++){
                        var myChannel = rows[i].USERNAME;
                       console.log(myChannel);
                    }*/
                    console.log('It works');
                    connection.release();
                    res.render('index', { title: 'User is oké' });


                });

    } else {
        console.error('CONNECTION error: ', err);
        res.statusCode = 503;
        res.send({
            result: 'error',
            err: err.code
        });
        console.log('It does not work...');
    }
        });

});

// GET account info and create new account.
//router.get('/ceateAccount', function(req,res,next) {

//});

module.exports = router;
