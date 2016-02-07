'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('jekyll-ghpages:github', function() {
  before(function(done) {
    this.app = helpers.run(path.join(__dirname, '../generators/github'))
      .withOptions({
        gh_page_type: 'user',
       })
      .on('end', done);
  });

  it('creates files', function() {
    assert(this.app.options.gh_page_type === 'user');
  });

});
