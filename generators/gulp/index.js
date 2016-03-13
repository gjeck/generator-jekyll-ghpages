'use strict';

var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.option('gh_page_type', {
      type: String,
      required: true,
      desc: 'Github page type (user, organization, or project)'
    });
  },

  initializing: function() {
    this._set_branch_option();
  },

  _set_branch_option: function() {
    var is_user_or_org = (/user|organization/i).test(this.options.gh_page_type);
    this.options.branch_name = is_user_or_org ? 'master' : 'gh-pages';
  },

  writing: function() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this.options
    );
  }
});
