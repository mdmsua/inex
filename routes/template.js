'use strict';
var express = require('express');
var router = express.Router();

router.get('/dashboard', function (req, res) {
  res.render('template/dashboard');
});

module.exports = router;
