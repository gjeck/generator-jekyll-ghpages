'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.option('project_name', {
      type: String,
      required: true,
      desc: 'Project name'
    });
    this.option('project_description', {
      type: String,
      required: true,
      desc: 'Project description'
    });
    this.option('project_homepage', {
      type: String,
      required: true,
      desc: 'Project homepage'
    });
    this.option('gh_page_type', {
      type: String,
      required: true,
      desc: 'Github pages type (user or project)'
    });
    this.option('gh_repo_name', {
      type: String,
      required: false,
      desc: 'Github repository name'
    });
    this.option('jekyll_permalinks', {
      type: String,
      required: true,
      desc: 'Jekyll permalinks style'
    });
    this.option('author_name', {
      type: String,
      required: true,
      desc: 'Author name'
    });
    this.option('author_email', {
      type: String,
      required: true,
      desc: 'Author email'
    });
    this.option('author_bio', {
      type: String,
      required: true,
      desc: 'Author bio'
    });
    this.option('author_github', {
      type: String,
      required: true,
      desc: 'Author Github profile'
    });
    this.option('author_twitter', {
      type: String,
      required: true,
      desc: 'Author Twitter profile'
    });
    this._adjust_gh_repo_name();
  },

  _adjust_gh_repo_name: function () {
    if (this.options.gh_repo_name) {
      this.options.gh_repo_name = '/' + this.options.gh_repo_name;
    } else {
      this.options.gh_repo_name = '';
    }
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('Gemfile'),
      this.destinationPath('Gemfile')
    );
    this.fs.copyTpl(
      this.templatePath('_config.yml'),
      this.destinationPath('_config.yml'),
      this.options
    );
    this.fs.copyTpl(
      this.templatePath('_config.production.yml'),
      this.destinationPath('_config.production.yml'),
      this.options
    );
    this.directory('app', 'app');
  }
});
