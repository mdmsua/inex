#!/usr/bin/env node
'use strict';

var app = require('./app'),
    debug = require('debug')('expenses:server'),
    server;

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function done() {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

function tls() {
  var https = require('https'),
      azureStorage = require('azure-storage'),
      blobService = azureStorage.createBlobService(),
      container = 'pem';
  blobService.getBlobToText(container, 'key.pem', function (keyError, key) {
    if (keyError) {
      throw keyError;
    }
    blobService.getBlobToText(container, 'cert.pem', function (certError, cert) {
      if (certError) {
        throw certError;
      }
      var options = {
        key: key,
        cert: cert
      };
      server = https.createServer(options, app);
      done();
    });
  });
}

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

if (app.get('env') === 'development') {
  var http = require('http');
  server = http.createServer(app);
  done();
}
else {
  tls();
}