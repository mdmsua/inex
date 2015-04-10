'use strict';
var express = require('express'),
    router = express.Router(),
    app = express();

router.get('/', function (req, res) {
    res.render(req.isAuthenticated() ? 'index' : 'landing', {
        title: 'Expenses',
        dev: app.get('env') === 'development'
    });
});

router.get('/404', function (req, res) {
   res.render ('404', {
       title: 'Page not found'
   });
});

module.exports = router;
