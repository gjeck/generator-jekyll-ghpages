'use strict';

var path = require('path'),
    assert = require('yeoman-generator').assert,
    helpers = require('yeoman-generator').test;

describe('jekyll-ghpages:gulp', function() {
  beforeEach(function(done) {
    helpers.run(path.join(__dirname, '../generators/gulp'))
      .on('end', done);
  });

  it('creates files', function() {
    assert.file([
      'gulpfile.js',
    ]);
  });

  describe('user', function() {
    beforeEach(function(done) {
      helpers.run(path.join(__dirname, '../generators/gulp'))
        .withOptions({
          gh_page_type: 'user',
         })
        .on('end', done);
    });

    it('sets the deploy branch to master', function() {
      assert.fileContent('gulpfile.js', /var deploy_branch = 'master'/);
    });
  });

  describe('project/org', function() {
    beforeEach(function(done) {
      helpers.run(path.join(__dirname, '../generators/gulp'))
        .withOptions({
          gh_page_type: 'project',
         })
        .on('end', done);
    });

    it('sets the deploy branch to gh-pages', function() {
      assert.fileContent('gulpfile.js', /var deploy_branch = 'gh-pages'/);
    });
  });

});
