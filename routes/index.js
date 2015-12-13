var express = require('express');
var mysql = require('mysql');
var bodyParser;
bodyParser = require('body-parser');
var router = express.Router();
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
router.post('/getAccount', function(req,res, next){
    console.log("GetAccount openend");
    connectionpool.getConnection(function(err, connection1) {
        console.log('Trying to connect');
        console.log(req.body.password);
        if (!err) {
            console.log('Trying to execute query now'),
                connectionpool.query('SELECT * FROM LOGIN WHERE (USERNAME ='   + connection1.escape(req.body.userName) +
                    'OR EMAIL =' +  connection1.escape(req.body.userName)
                         +') AND PASSWORD =' + (connection1.escape(req.body.password)),
                function (err, rows) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.send({
                            result: 'error',
                            err: err.code
                        });
                        connection1.release();
                        console.log('It doesnt work error 500');
                    }
                    if (rows.length == 0){
                     res.render('login', { title: 'Login - User not found' });
                     }
                    console.log('Go-TO next');
                    connection1.release();
                    getActivities(req, res,rows);
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

function getActivities(req,res, rows)
{

    rows.forEach(function getoutput(item) {
        console.log("getActivities openend");
        console.log(item.USER_ID);
        connectionpool.getConnection(function(err, connection2) {
            console.log('Trying to connect to activities');
            console.log(req.body.password);
            if (!err) {
                console.log('Trying to execute query for activities now'),
                    connectionpool.query('SELECT * FROM ACTIVITY WHERE LOGIN_ID =' + connection2.escape(item.USER_ID),
                        function (err, rows) {
                            if (err) {
                                console.error(err);
                                res.statusCode = 500;
                                res.send({
                                    result: 'error',
                                    err: err.code
                                });
                                connection.release();
                                console.log('It doesnt work error 500');
                            }
                            if (rows.length == 0) {
                                res.render('index', {title: 'Index - Activity not found'});
                            }
                            console.log('Show activities');
                            connection2.release();
                            res.render('viewUserActivities', {activities:rows , title: 'Created activities'});
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
}


        router.get('/viewUserActivities', function(req, res, next) {
    res.render('viewUserActivities', { title: 'View your activities (get)' });
});

router.get('/OrganizeActivity', function(req, res, next) {
    res.render('OrganizeActivity', { title: 'Organize a new activity' });
});

// GET account info and create new account.
//router.get('/ceateAccount', function(req,res,next) {

//});

module.exports = router;
