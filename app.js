// Module Declaration
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost:27017/web');
var routes = require('./routes/index');

// Express
var app = express();

// Set View Engine with Jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Underscore
_ = require('underscore');

// Set DB
//var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/data';
//mongo.Db.connect(mongoUri, function (err, db) {
  /*db.collection('mydocs', function(er, collection) {
    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
    });
  });*/
//});
app.use(function(req, res, next) {
    req.db = db;
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

// <!-- bin/www Start -->
// > node-inspector
// > node --debug ./bin/www
// This configuration moved from bin/www.
// To use <pre>npm start</pre> again, remove this snippet and uncomment the last line in this file.
/*var debug = require('debug')('arteest');
//var app = require('../app');
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});*/
// <!-- bin/www End -->
module.exports = app;