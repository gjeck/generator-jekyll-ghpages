'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('jekyll-ghpages:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({
        project_title: 'jekyll-ghpages-test',
        project_description: 'a test project',
        project_homepage: 'www.testhome.com',
        create_cname: 'y',
        project_url: 'www.testdomain.com',
        gh_page_type: 'user',
        jekyll_permalinks: 'pretty',
        author_name: 'tester',
        author_email: 'tester@test.com',
        author_bio: 'I love tests',
        author_github: 'tester',
      })
      .withGenerators([
        [helpers.createDummyGenerator(), 'jekyll-ghpages:jekyll'],
        [helpers.createDummyGenerator(), 'jekyll-ghpages:gulp'],
      ])
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'package.json',
      'CNAME',
      '.gitignore',
      '.editorconfig',
      '.jshintrc'
    ]);
  });

  it('creates CNAME with domain', function () {
    assert.fileContent('CNAME', /www\.testdomain\.com/);
  });
});
