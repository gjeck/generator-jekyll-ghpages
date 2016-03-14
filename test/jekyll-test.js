'use strict';

var path = require('path'),
    assert = require('yeoman-assert'),
    helpers = require('yeoman-test');

describe('jekyll-ghpages:jekyll', function() {
  beforeEach(function(done) {
    helpers.run(path.join(__dirname, '../generators/jekyll'))
      .withOptions({
        project_title: 'test',
        gh_page_type: 'project',
        gh_repo_name: 'test-repo'
       })
      .on('end', done);
  });

  it('creates files', function() {
    assert.file([
      'Gemfile',
      'app',
      '_config.yml',
      '_config.production.yml'
    ]);
  });

  it('adds baseurl to _config.production.yml', function() {
    assert.fileContent('_config.production.yml', /baseurl: '\/test-repo'/);
  });
});
