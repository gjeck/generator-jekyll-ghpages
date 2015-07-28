'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

var linter = require('mocha-jshint')({
  paths: [ 
    './generators/',
  ]
});

describe('jekyll-ghpages:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'bower.json',
      'package.json',
      'Gemfile',
      '.gitignore',
      '.editorconfig',
      '.jshintrc'
    ]);
  });
});
