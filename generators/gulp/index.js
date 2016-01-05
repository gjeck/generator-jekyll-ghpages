'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.option('gh_page_type', {
      type: String,
      required: true,
      desc: 'Github page type (user or project)'
    });
    this._set_branch_option();
  },

  _set_branch_option: function() {
    this.options.branch_name = this.options.gh_page_type === 'user' ? 'master' : 'gh-pages';
  },

  writing: function() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this.options
    );
  }
});
