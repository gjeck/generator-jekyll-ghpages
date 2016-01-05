'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');


module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install', {
      desc: 'Skip installing dependencies',
      type: Boolean
    });
  },

  initializing: function() {
    this.props = {};
  },

  prompting: function() {
    var done = this.async();

    this.log(yosay(
      'Welcome to the ' + chalk.red('JekyllGhpages') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'project_title',
      message: 'What is the title of your project?'
    }, {
      type: 'input',
      name: 'project_description',
      message: 'Describe your project for me:'
    }, {
      type: 'input',
      name: 'project_homepage',
      message: 'Enter homepage for project (e.g github repo url)'
    }, {
      type: 'confirm',
      name: 'create_cname',
      message: 'Will you use a custom domain?',
      default: 'Y/n'
    }, {
      type: 'input',
      name: 'project_url',
      message: 'Enter custom domain (project url)',
      when: function(props) {
        return props.create_cname;
      }
    }, {
      type: 'list',
      name: 'gh_page_type',
      message: 'What type of github pages project is this?' +
               chalk.yellow('\n  learn more at https://pages.github.com/'),
      choices: ['user', 'project']
    }, {
      type: 'input',
      name: 'gh_repo_name',
      message: 'Enter the name of your Github repo',
      when: function(props) {
        return (/project/i).test(props.gh_page_type);
      }
    }, {
      type: 'list',
      name: 'jekyll_permalinks',
      message: 'Permalink style' + (chalk.yellow(
                  '\n  pretty: /:year/:month/:day/:title/' +
                  '\n  date:   /:year/:month/:day/:title.html' +
                  '\n  none:   /:categories/:title.html')) + '\n',
      choices: ['pretty', 'date', 'none']
    }];

    this.prompt(prompts, function(props) {
      this.props = _.extend(this.props, props);
      this.props.project_title_slug = _.kebabCase(props.project_title);
      if (props.create_cname) {
          this.props.project_url = props.project_url;
      }

      done();
    }.bind(this));
  },

  authorPrompting: function() {
    var done = this.async();

    this.log(chalk.yellow('\nNow tell me a bit about yourself. '));

    var prompts = [{
      type: 'input',
      name: 'author_name',
      message: 'What is your name?'
    }, {
      type: 'input',
      name: 'author_email',
      message: 'What is your email?'
    }, {
      type: 'input',
      name: 'author_bio',
      message: 'Write a short description of yourself:'
    }, {
      type: 'input',
      name: 'author_github',
      message: 'Your github handle:'
    }, {
      type: 'input',
      name: 'author_twitter',
      message: 'Your twitter handle:'
    }];

    this.prompt(prompts, function(props) {
      this.props = _.extend(this.props, props);
      done();
    }.bind(this));
  },

  writing: {
    projectfiles: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.props
      );
      if ((/y/i).test(this.props.create_cname)) {
        this.fs.copyTpl(
          this.templatePath('_CNAME'),
          this.destinationPath('CNAME'),
          this.props
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

  default: function() {
    this.composeWith('jekyll-ghpages:jekyll', {
      options: {
        project_title: this.props.project_title,
        project_description: this.props.project_description,
        project_homepage: this.props.project_homepage,
        gh_page_type: this.props.gh_page_type,
        gh_repo_name: this.props.gh_repo_name,
        jekyll_permalinks: this.props.jekyll_permalinks,
        author_name: this.props.author_name,
        author_email: this.props.author_email,
        author_bio: this.props.author_bio,
        author_github: this.props.author_github,
        author_twitter: this.props.author_twitter
      },
    });
    this.composeWith('jekyll-ghpages:gulp', {
      options: {
        gh_page_type: this.props.gh_page_type
      },
    });
  },

  install: function() {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
    if (!this.options['skip-install']) {
        this.spawnCommand('bundle', ['install']);
    }
  }
});
