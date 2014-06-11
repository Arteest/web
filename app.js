// Module Declaration
var newrelic = require('newrelic');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost:27017/web');
var nodemailer = require('nodemailer');
var routes = require('./routes/index');

// Express
var app = express();

// Set View Engine with Jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configure Other Requires
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Underscore
_ = require('underscore');

// Email SMTP
var smtp = nodemailer.createTransport('SMTP', {
    service: 'gmail',
    auth: {
        user: process.env.SMTP_PRODUCTION_USER,
        pass: process.env.SMTP_PRODUCTION_PASS
    }
});

// Pass the DB object through the request
app.use(function(req, res, next) {
    req.db = db;
    req.smtp = smtp;
    next();
});

// Routing
app.use('/', routes);

// 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development Error Handler (prints stack trace)
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Error Handler (sends empty object)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;