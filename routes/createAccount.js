/**
 * Created by dentorfs_ on 30/12/15.
 */
var express = require('express');
var mysql = require('mysql');
var bodyParser;
bodyParser = require('body-parser');
var app = express();
var connectionpool = require('../config/database');
var moment = require('moment');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

module.exports = {
    createAccount: function createAccount(req,res, rows)
    {
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
    }
};
