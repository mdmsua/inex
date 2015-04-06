'use strict';
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    debug = require('debug')('expenses:server'),
    Database = require('./modules/database');

var index = require('./routes/index'),
    template = require('./routes/template'),
    auth = require('./routes/auth');

var database = new Database(process.env.MONGODB);

Database.open();

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        debug(accessToken);
        debug(refreshToken);
        debug(profile);
        done(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.provider + '://' + user.id);
});

passport.deserializeUser(function(id, done) {
    var provider = id.split(split)[0],
        username = id.split(split)[1];
    //User.findById(id, function(err, user) {
    //    done(err, user);
    //});
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({ secret: 'expenses' }));
app.use(express.static(path.join(__dirname, 'public')));
if (app.get('env') === 'development') {
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.static(path.join(__dirname, 'bower_components')));
}

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/template', template);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.render('index', { title: 'Expenses', dev: app.get('env') === 'development' });
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
