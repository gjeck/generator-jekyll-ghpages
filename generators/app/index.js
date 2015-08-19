'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install', {
      desc: 'Skip installing dependencies',
      type: Boolean
    });
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('JekyllGhpages') + ' generator!'
    ));

    var prompts = [{
      name: 'project_title',
      message: 'What is the title of your project?',
    }, {
      name: 'project_description',
      message: 'Describe your project for me:',
    }, {
      name: 'project_homepage',
      message: 'Enter homepage for project (e.g github repo url)',
    }, {
      type: 'confirm',
      name: 'create_cname',
      message: 'Will you use a custom domain?',
    }, {
      when: function(props) { return props.create_cname; },
      name: 'project_url',
      message: 'Enter custom domain (project url)',
    }, {
      type: 'list',
      name: 'ghpage_type',
      message: 'What type of github pages project is this?' + 
               chalk.yellow('\n  learn more at https://pages.github.com/'),
      choices: ['user', 'project'],
    }, {
      name: 'jekyll_permalinks',
      type: 'list',
      message: 'Permalink style' + (chalk.yellow(
                  '\n  pretty: /:year/:month/:day/:title/' +
                  '\n  date:   /:year/:month/:day/:title.html' +
                  '\n  none:   /:categories/:title.html')) + '\n',
      choices: ['pretty', 'date', 'none'],
    }];

    this.prompt(prompts, function (props) {
      this.project_title = props.project_title;
      this.project_title_slug = _.kebabCase(this.project_title);
      this.project_description = props.project_description;
      this.project_url = props.project_url;
      this.create_cname = props.create_cname;
      if (this.create_cname) {
          this.project_url = props.project_url;
      }
      this.ghpage_type = props.ghpage_type;
      this.jekyll_permalinks = props.jekyll_permalinks;

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
      message: 'Your github handle:'
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
    projectfiles: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      if (this.create_cname) {
        this.fs.copy(
          this.templatePath('_CNAME'),
          this.destinationPath('CNAME')
        );
      }
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
