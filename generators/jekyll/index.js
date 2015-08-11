'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The subgenerator name'
    });

    this.log('You called the JekyllGhpages subgenerator with the argument ' + this.name + '.');
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('_Gemfile'),
      this.destinationPath('Gemfile')
    );
    this.directory('app', 'app');
  }
});
