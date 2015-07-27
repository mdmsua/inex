'use strict';
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    passport = require('passport'),
    mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB);

var index = require('./routes/index'),
    auth = require('./routes/auth'),
    dashboard = require('./routes/dashboard'),
    account = require('./routes/account');

var authorize = require('./middleware/authorize'),
    user = require('./middleware/user');

require('./models/passport')(passport, process.env.HOST);

var app = express(),
    options = {
        url: process.env.MONGODB
    };

function env(req, res, next) {
    res.locals.dev = app.get('env') === 'development';
    next();
}

var production = app.get('env') !== 'development';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.disable('etag');

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'coin-stack',
    store: new MongoStore(options),
    secure: production,
    resave: false,
    saveUninitialized: false
}));
if (app.get('env') === 'development') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.use(express.static(path.join(__dirname, 'assets')));
    app.use(express.static(path.join(__dirname, 'bower_components')));
}

app.use(passport.initialize());
app.use(passport.session());

app.use('/', env, index);
app.use('/auth', auth);
app.use('/dashboard', authorize, user, dashboard);
app.use('/account', authorize, user, account);

// error handlers

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.render('failure', {title: 'Page not found'});
});

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
