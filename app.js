'use strict';
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    redis = require('redis'),
    RedisStore = require('connect-redis')(session),
    passport = require('passport'),
    debug = require('debug')('expenses:server'),
    MongoClient = require('mongodb').MongoClient,
    Database = require('./modules/database');

var index = require('./routes/index'),
    template = require('./routes/template'),
    auth = require('./routes/auth');

var database = new Database(MongoClient, process.env.MONGODB);

Database.open();

require('./modules/passport')(passport, database);

function authorize(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

var app = express(),
    options = {
        client: redis.createClient(),
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASS,
        prefix: 'session:'
    };

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'coin-stack', store: new RedisStore(options)}));
app.use(express.static(path.join(__dirname, 'public')));
if (app.get('env') === 'development') {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.static(path.join(__dirname, 'assets')));
    app.use(express.static(path.join(__dirname, 'bower_components')));
}

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/template', template);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.render('index', {title: 'Expenses', dev: app.get('env') === 'development'});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
