'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('JekyllGhpages') + ' generator!'
    ));

    var prompts = [{
      name: 'projectTitle',
      message: 'What is the title of your project?'
    }, {
      name: 'projectDescription',
      message: 'Describe your project for me:'
    }];

    this.prompt(prompts, function (props) {
      this.projectTitle = props.projectTitle;
      this.projectDescription = props.projectDescription;

      done();
    }.bind(this));
  },

  authorPrompting: function () {
    var done = this.async();

    this.log(chalk.yellow('\nNow tell me a bit about yourself. '));

    var prompts = [{
      name: 'authorName',
      message: 'What is your name?'
    }, {
      name: 'authorEmail',
      message: 'What is your email?'
    }, {
      name: 'authorBio',
      message: 'Write a short description of yourself:'
    }, {
      name: 'authorGithub',
      message: 'Your Github handle:'
    }];

    this.prompt(prompts, function (props) {
      this.authorName = props.authorName;
      this.authorEmail = props.authorEmail;
      this.authorBio = props.authorBio;
      this.authorGithub = props.authorGithub;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
      this.fs.copy(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );
      this.fs.copy(
        this.templatePath('_Gemfile'),
        this.destinationPath('Gemfile')
      );
      this.directory('app', 'app');
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
    if (!this.options['skip-install']) {
        this.spawnCommand('bundle', ['install']);
    }
  }
});
