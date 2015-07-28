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
      name: 'project_title',
      message: 'What is the title of your project?'
    }, {
      name: 'project_description',
      message: 'Describe your project for me:'
    }, {
      name: 'project_url',
      message: 'Enter project url (domain)'
    }];

    this.prompt(prompts, function (props) {
      this.project_title = props.project_title;
      this.project_description = props.project_description;
      this.project_url = props.project_url;

      done();
    }.bind(this));
  },

  authorPrompting: function () {
    var done = this.async();

    this.log(chalk.yellow('\nNow tell me a bit about yourself. '));

    var prompts = [{
      name: 'author_name',
      message: 'What is your name?'
    }, {
      name: 'author_email',
      message: 'What is your email?'
    }, {
      name: 'author_bio',
      message: 'Write a short description of yourself:'
    }, {
      name: 'author_github',
      message: 'Your Github handle:'
    }];

    this.prompt(prompts, function (props) {
      this.author_name = props.author_name;
      this.author_email = props.author_email;
      this.author_bio = props.author_bio;
      this.author_github = props.author_github;

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
