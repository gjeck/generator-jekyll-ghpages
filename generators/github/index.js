'use strict';

var yeoman = require('yeoman-generator'),
    github = require('octonode');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.option('gh_user_name', {
      type: String,
      required: true,
      desc: 'User name'
    });
    this.option('gh_page_type', {
      type: String,
      required: true,
      desc: 'Page type (user, organization, or project)'
    });
    this.option('gh_auth_type', {
      type: String,
      required: true,
      desc: 'Authentication type (password, access token)'
    });
    this.option('gh_repo_name', {
      type: String,
      required: true,
      desc: 'Repository name'
    });
    this.option('project_description', {
      type: String,
      required: true,
      desc: 'Project description'
    });
    this.option('gh_org_name', {
      type: String,
      required: false,
      desc: 'Organization name'
    });
    this.option('gh_password', {
      type: String,
      required: false,
      desc: 'Password'
    });
    this.option('gh_access_token', {
      type: String,
      required: false,
      desc: 'Access token'
    });
    this.options.gh_logs = [];
  },

  createRepo: function() {
    var client = this._getClient();
    var gh;
    if ((/user|project/i).test(this.options.gh_page_type)) {
      gh = client.me();
    } else {
      gh = client.org(this.options.gh_org_name);
    }
    var self = this;
    gh.repo({
      'name': this.options.gh_repo_name,
      'description': this.options.project_description
    }, function(data) {
      self.options.gh_logs.push(data);
    });
  },

  _getClient: function() {
    switch(this.options.gh_auth_type) {
      case 'auth_password':
        return github.client(this.options.gh_access_token);
      case 'auth_token':
        return github.client({
          username: this.options.gh_user_name,
          password: this.options.gh_password
        });
      default :
        break;
    }
  },

});
