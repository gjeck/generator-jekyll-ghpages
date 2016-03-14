'use strict';

var path = require('path'),
    assert = require('yeoman-assert'),
    helpers = require('yeoman-test');

describe('jekyll-ghpages:app', function() {
  beforeEach(function(done) {
    this.app = helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        project_title: 'jekyll-ghpages-test',
        project_description: 'a test project',
        create_cname: 'y',
        project_url: 'www.testdomain.com',
        gh_user_name: 'gob_bluth',
        gh_page_type: 'user',
        gh_should_create: false,
        jekyll_permalinks: 'pretty',
        author_name: 'tester',
        author_email: 'tester@test.com',
        author_bio: 'I love tests',
      })
      .withGenerators([
        [helpers.createDummyGenerator(), 'jekyll-ghpages:jekyll'],
        [helpers.createDummyGenerator(), 'jekyll-ghpages:gulp'],
        [helpers.createDummyGenerator(), 'jekyll-ghpages:github']
      ])
      .on('end', done);
  });

  it('creates files', function() {
    assert.file([
      'package.json',
      'CNAME',
      '.gitignore',
      '.editorconfig',
      '.jshintrc',
      '.nojekyll'
    ]);
  });

  it('creates CNAME with domain', function() {
    assert.fileContent('CNAME', /www\.testdomain\.com/);
  });

  describe('user', function() {
    it('creates a correct github homepage url', function() {
      var user = this.app.generator.props.gh_user_name,
          test_homepage = this.app.generator.props.project_homepage,
          expected = 'https://github.com/' + user + '/' + user + '.github.io';
      assert.equal(test_homepage, expected);
    });
  });

  describe('project/org', function() {
    beforeEach(function(done) {
      this.app = helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({ skipInstall: true })
        .withPrompts({
          gh_should_create: false,
          gh_user_name: 'gob_bluth',
          gh_page_type: 'project',
          gh_repo_name: 'magic'
        })
        .withGenerators([
          [helpers.createDummyGenerator(), 'jekyll-ghpages:jekyll'],
          [helpers.createDummyGenerator(), 'jekyll-ghpages:gulp'],
          [helpers.createDummyGenerator(), 'jekyll-ghpages:github']
        ])
        .on('end', done);
    });

    it('creates a correct github homepage url', function() {
      var user = this.app.generator.props.gh_user_name,
          repo = this.app.generator.props.gh_repo_name,
          test_homepage = this.app.generator.props.project_homepage,
          expected = 'https://github.com/' + user + '/' + repo;
      assert.equal(test_homepage, expected);
    });
  });

});
