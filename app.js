var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var routes = require('./routes');
/*var users = require('./routes_old/users');
var singup = require('./routes_old/signup');
var login = require('./routes_old/login');*/
var app = express();
module.exports = app;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.get('/', routes);
app.get('/login', routes);
app.get('/singup', routes);
app.get('/getAccount', routes);

/*app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/signup', routes.signup);*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

connectionpool = mysql.createPool({
  host     : process.env.OPENSHIFT_EXTMYSQL_DB_HOST,
  user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
  password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
  port     :  process.env.OPENSHIFT_MYSQL_DB_PORT,
  database : 'php'
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



