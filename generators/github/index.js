'use strict';

var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.option('gh_page_type', {
      type: String,
      required: true,
      desc: 'Github page type (user, organization, or project)'
    });
  },
});
