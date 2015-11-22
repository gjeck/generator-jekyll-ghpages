'use strict';
var gulp = require('gulp'),
    browser_sync = require('browser-sync').create(),
    shell = require('shelljs'),
    sass = require('gulp-sass'),
    mincss = require('gulp-minify-css'),
    minhtml = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    del = require('del');

var paths = {
  sass:   ['app/assets/css/*.scss'],
  js:     ['app/assets/js/*.js'],
  html:   ['.jekyll_tmp/**/*.html'],
  tmpcss: ['.tmp/*.css'],
  tmp:    '.tmp/',
  dist:   '.dist/',
  dcss:   '.dist/assets/css/',
  djs:    '.dist/assets/js/'
};

gulp.task('build', function() {
  shell.exec('bundle exec jekyll build');
});

gulp.task('build:prod', function() {
  shell.exec('bundle exec jekyll build --config _config.yml,_config.production.yml');
});

gulp.task('doctor', function() {
  shell.exec('bundle exec jekyll doctor');
});

gulp.task('sass', function() {
  return gulp.src(paths.sass)
             .pipe(sass())
	           .pipe(gulp.dest(paths.tmp))
});

gulp.task('source_styles', ['sass'], function() {
  return gulp.src(paths.tmpcss)
             .pipe(concat('main.css'))
	           .pipe(mincss())
	           .pipe(gulp.dest(paths.dcss))
	           .pipe(browser_sync.stream())
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});

gulp.task('source_scripts', function() {
  return gulp.src(paths.js)
             .pipe(concat('main.js'))
	           .pipe(uglify())
	           .pipe(gulp.dest(paths.djs))
});

gulp.task('html', function() {
  return gulp.src(paths.html)
             .pipe(minhtml())
	           .pipe(gulp.dest(paths.dist));
});

gulp.task('js-watch', ['source_scripts'], browser_sync.reload);

gulp.task('serve', function() {
  browser_sync.init({
    server: {
      baseDir: '.dist/'
    }
  });

  gulp.watch(paths.sass, ['source_styles']);
  gulp.watch(paths.js, ['js-watch']);
});

gulp.task('default', ['build'], function() {
  console.log('done');
});
