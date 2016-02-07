'use strict';

var path = require('path');

require('mocha-jshint')({
  paths: [
    path.join(__dirname, '../generators'),
    path.join(__dirname, '../test'),
  ],
});
