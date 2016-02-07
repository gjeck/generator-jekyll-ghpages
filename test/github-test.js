'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('jekyll-ghpages:github', function() {
  before(function(done) {
    this.app = helpers.run(path.join(__dirname, '../generators/github'))
      .withOptions({
        gh_user_name: 'gob',
        gh_page_type: 'project',
        gh_auth_type: 'auth_password',
        gh_repo_name: 'magic',
        gh_password: 'ivemadeahugemistake',
        project_description: 'I did it! I sunk the yacht!'
       })
      .on('end', done);
  });

  it('creates files', function() {
    assert(this.app.options.gh_page_type === 'project');
  });

});
