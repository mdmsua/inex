'use strict';
var express = require('express');
var router = express.Router();
var app = express();

router.get('/', function (req, res) {
  res.render('index', { title: 'Expenses', dev: app.get('env') === 'development' });
});

module.exports = router;
