'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.option('gh_page_type', {
      type: String,
      required: true,
      desc: 'Github page type (user or project)'
    });
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this.options
    );
  }
});
