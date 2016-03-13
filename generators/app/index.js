'use strict';

var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    _ = require('lodash');

module.exports = yeoman.Base.extend({

  constructor: function() {
    yeoman.Base.apply(this, arguments);

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

    this.log(chalk.yellow('Let\'s get you a website up on github.\n' +
    'Learn more at https://pages.github.com/\n\n') +
    'First I\'m going to ask you a bunch of questions and I want them\n' +
    'answered immediately\n'
    );

    var prompts = [{
      type: 'input',
      name: 'gh_user_name',
      message: 'What is your github username?'
    }, {
      type: 'list',
      name: 'gh_page_type',
      message: 'What type of github pages project is this?',
      choices: ['user', 'project', 'organization']
    }, {
      type: 'input',
      name: 'gh_org_name',
      message: 'What is the organization name?',
      when: function(props) {
        return props.gh_page_type === 'organization';
      }
    }, {
      type: 'input',
      name: 'gh_repo_name',
      message: 'Enter the name of your Github repo',
      when: function(props) {
        return (/project|organization/i).test(props.gh_page_type);
      }
    }, {
      type: 'confirm',
      name: 'gh_should_create',
      message: 'Do you want to create your repo with this generator?',
      default: 'Y/n'
    }, {
      type: 'list',
      name: 'gh_auth_type',
      message: 'How do you want to authenticate on github?',
      choices: ['auth_password', 'auth_token'],
      when: function(props) {
        return props.gh_should_create;
      }
    }, {
      type: 'password',
      name: 'gh_password',
      message: 'Enter your github password',
      when: function(props) {
        return props.gh_auth_type === 'auth_password';
      }
    }, {
      type: 'token',
      name: 'gh_access_token',
      message: 'Enter a github access token',
      when: function(props) {
        return props.gh_auth_type === 'auth_token';
      }
    }, {
      type: 'confirm',
      name: 'create_cname',
      message: 'Do you want to use a custom domain?',
      default: 'Y/n'
    }, {
      type: 'input',
      name: 'project_url',
      message: 'Enter custom domain (e.g. www.mysite.com)',
      when: function(props) {
        return props.create_cname;
      }
    }];

    this.prompt(prompts, function(props) {
      this.props = _.extend(this.props, props);
      if (this.props.gh_page_type === 'user') {
        props.gh_repo_name = this.props.gh_user_name + '.github.io';
        this.props.gh_repo_name = props.gh_repo_name;
      }
      this.props.project_homepage = this._githubProjectURL(
        props.gh_user_name,
        props.gh_org_name,
        props.gh_repo_name
      );
      if (props.create_cname) {
          this.props.project_url = props.project_url;
      }

      done();
    }.bind(this));
  },

  _githubProjectURL: function(username, org, repo) {
    var baseURL = 'https://github.com',
        potentials = [username, org, repo],
        toAdd = _.filter(potentials, function(v) { return v; });

    return _.reduce(toAdd, function(total, add) {
      return total + '/' + add;
    }, baseURL);
  },

  projectPrompting: function() {
    var done = this.async();

    this.log(chalk.yellow('\nNow tell me about your project. '));

    var prompts = [{
      type: 'input',
      name: 'project_title',
      message: 'What is the title of your project?'
    }, {
      type: 'input',
      name: 'project_description',
      message: 'Describe your project for me:'
    }];

    this.prompt(prompts, function(props) {
      this.props = _.extend(this.props, props);
      this.props.project_title_slug = _.kebabCase(props.project_title);
      done();
    }.bind(this));
  },

  jekyllPrompting: function() {
    var done = this.async();

    var prompts = [ {
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
        author_github: this.props.gh_user_name,
        author_twitter: this.props.author_twitter
      },
    });
    this.composeWith('jekyll-ghpages:gulp', {
      options: {
        gh_page_type: this.props.gh_page_type
      },
    });
    if (this.props.gh_should_create) {
      this.composeWith('jekyll-ghpages:github', {
        options: {
          gh_user_name: this.props.gh_user_name,
          gh_page_type: this.props.gh_page_type,
          gh_auth_type: this.props.gh_auth_type,
          gh_repo_name: this.props.gh_repo_name,
          gh_org_name: this.props.gh_org_name,
          gh_password: this.props.gh_password,
          gh_access_token: this.props.gh_access_token,
          project_description: this.props.project_description
        },
      });
    }
  },

  install: function() {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
    if (!this.options['skip-install']) {
      this.spawnCommand('bundle', ['install']);
    }
    if (this.props.gh_should_create) {
      this.spawnCommandSync('git', ['init']);
      this.spawnCommandSync('git', ['add', '.']);
      this.spawnCommandSync('git', ['commit', '-m', '"Initial Commit"']);
      this.spawnCommandSync('git', ['remote', 'add', 'origin', this.props.project_homepage]);
      this.spawnCommandSync('git', ['push', '-u', 'origin', 'master']);
    }
  },

  end: function() {

  }
});
