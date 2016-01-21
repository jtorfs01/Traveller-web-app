var express = require('express');
var mysql = require('mysql');
var bodyParser;
bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var activityDates = require('./getActivitiesDate');
var createAccount = require('./createAccount');
var connectionpool = require('../config/database');
var moment = require('moment');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


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
                                connection2.release();
                                console.log('It doesnt work error 500');
                            }
                            if (rows.length == 0) {
                                res.render('index', {title: 'Index - Activity not found'});
                            }
                            console.log('Go-TO next');
                            connection2.release();
                            activityDates.activity(req, res,rows);
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

/* Save changes to existing activities */
router.post('/saveActivity', function(req, res, next) {
    var extraDatesArray = [];

    console.log('This is the name of the activity');
    console.log(req.body.name);
  //  console.log(req.body.activityId);
  //  console.log(req.body.activityDatesSelect);

    extraDatesArray.push(req.body.activityDatesDiv);
    console.log(extraDatesArray);

    for(i = 0; i <= extraDatesArray.length; i++)
    {
        console.log(i);
        console.log(extraDatesArray[i]);
    }

    //Open new connection
    connectionpool.getConnection(function(err, connection4) {
        console.log('Trying to connect');
        console.log(req.body.password);

        if (!err) {
            console.log('Trying to execute query now'),
                connectionpool.query('SELECT * FROM LOGIN WHERE (USERNAME ='   + connection4.escape(req.body.userName) +
                    'OR EMAIL =' +  connection4.escape(req.body.userName)
                    +') AND PASSWORD =' + (connection4.escape(req.body.password)),
                    function (err, rows) {
                        if (err) {
                            console.error(err);
                            res.statusCode = 500;
                            res.send({
                                result: 'error',
                                err: err.code
                            });
                            connection4.release();
                            console.log('It doesnt work error 500');
                        }
                        if (rows.length == 0){
                            res.render('login', { title: 'Login - User not found' });
                        }
                        console.log('Go-TO next');
                        connection4.release();
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

// GET account info and create new account.
router.post('/createAccount', function(req, res, next) {
    console.log("createAccount openend");
    connectionpool.getConnection(function(err, connection5) {
        console.log('Trying to connect');
        console.log(req.body.password);
        if (!err) {
            console.log('Trying to execute query now');
            console.log(req.body.firstName);

            connectionpool.query('INSERT INTO LOGIN VALUES (' + connection5.escape(req.body.firstName) + ' , ' +
                connection5.escape(req.body.password) + ' , ' +
                connection5.escape(req.body.email)),
                function (err, rows) {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.send({
                            result: 'error',
                            err: err.code
                        });
                        connection5.release();
                        console.log('It doesnt work error 500');
                    }
                    console.log('Created account.');
                    connection5.release();
                    getActivities(req, res,rows);
                };
        }
        else {
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


module.exports = router;
