'use strict';

var proxyquire = require('proxyquire'),
    path = require('path'),
    assert = require('yeoman-assert'),
    helpers = require('yeoman-test');

describe('jekyll-ghpages:github', function() {
  beforeEach(function(done) {
    var gh_instance_stub = {
      token: '',
      repo: function(opts, cb) {
        var error;
        var data = opts;
        var headers;
        cb(error, data, headers);
      }
    };
    var gh_client_stub = {
      token: '',
      me: function() {
        return gh_instance_stub;
      },
      org: function(token) {
        gh_instance_stub.token = token;
        return gh_instance_stub;
      }
    };
    var gh_stub = {
      client: function(token) {
        gh_client_stub.token = token;
        return gh_client_stub;
      },
    };
    proxyquire('../generators/github', { 'octonode': gh_stub });

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

  it('authenticates on github with a password', function() {
    var expected = [
      { 'name': 'magic', 'description': 'I did it! I sunk the yacht!' }
    ];
    assert.deepEqual(this.app.generator.options.gh_logs, expected);
  });

});
