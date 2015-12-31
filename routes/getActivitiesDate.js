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
    activity: function getActivitiesDate(req,res, rows)
    {
        var rowsArrayBracket = [];
        var rowsArrayWithoutBracket = [];
        var rowsResult = rows;
        var rowsCounter = 1;
        rows.forEach(function getoutput(item) {
            console.log("getActivitiesDate openend");
            connectionpool.getConnection(function(err, connection3) {
                console.log('Trying to connect to activities date');
                if (!err) {
                    console.log('Trying to execute query for activities now'),
                        connectionpool.query('SELECT * FROM CALENDAR_ACTIVITY WHERE ACTIVITY_ID =' + connection3.escape(item.ACTIVITY_ID),
                            function (err, rows2) {
                                if (err) {
                                    console.error(err);
                                    res.statusCode = 500;
                                    res.send({
                                        result: 'error',
                                        err: err.code
                                    });
                                    connection3.release();
                                    console.log('It doesnt work error 500');
                                }
                                /* if (rows2.length == 0) {
                                 res.render('index', {title: 'Index - Calendar Activity not found'});
                                 }*/
                                console.log('result from rows2');

                                for (i = 0; i < rows2.length; i++) {
                                    console.log('Number' + i + ' = ' + rows2[i]);
                                    rowsArrayWithoutBracket.push(rows2[i]);
                                }

                                // rows3.push(rows2[0]);

                                if(rowsCounter == rows.length){
                                    console.log('Show activities + dates');
                                    console.log('This is the result of rows2Result: ');
                                    console.log(rowsArrayWithoutBracket);

                                    res.render('viewUserActivities', {activities:rows, activityDates:rowsArrayWithoutBracket , title: 'Created activities', moment: moment});
                                } else {
                                    rowsCounter++;
                                }

                                //  connection3.release();
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
}

/*Functions that aren't accesible from outside this file should be placed here.*/
//var zemba = function () {
//}