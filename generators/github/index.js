'use strict';

var yeoman = require('yeoman-generator'),
    github = require('octonode'),
    chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

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
  },

  initializing: function() {
    this.options.gh_logs = [];
  },

  createRepo: function() {
    var done = this.async();

    var client = this._getClient();
    var gh;
    if ((/user|project/i).test(this.options.gh_page_type)) {
      gh = client.me();
    } else {
      gh = client.org(this.options.gh_org_name);
    }
    gh.repo({
      name: this.options.gh_repo_name,
      description: this.options.project_description
    }, function(err, data, headers) {
      if (err) {
        this.options.gh_logs.push(err);
        this._errorExit(err);
      }
      if (data) {
        this.options.gh_logs.push(data);
      }
      if (headers) {
        this.options.gh_logs.push(headers);
      }
      done();
    }.bind(this));
  },

  _getClient: function() {
    switch(this.options.gh_auth_type) {
      case 'auth_token':
        return github.client(this.options.gh_access_token);
      case 'auth_password':
        return github.client({
          username: this.options.gh_user_name,
          password: this.options.gh_password
        });
      default :
        break;
    }
  },

  _errorExit: function(err) {
    this.log(chalk.red('\nDang, github came back with an error.\n' +
    'Please run the generator again to retry'
    ));
    this.env.error(err);
  },

});
