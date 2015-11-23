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
    gzip = require('gulp-gzip'),
    del = require('del');

var paths = {
  sass:   ['app/assets/css/*.scss'],
  js:     ['app/assets/js/*.js'],
  html:   ['.jekyll_tmp/**/*.html'],
  xml:    ['.jekyll_tmp/**/*.xml'],
  tmp:    '.jekyll_tmp/',
  dist:   '.dist/',
  dcss:   '.dist/assets/css/',
  djs:    '.dist/assets/js/'
};

gulp.task('clean', function() {
  return del([paths.tmp, paths.dist]);
});

gulp.task('doctor', function(cb) {
  shell.exec('bundle exec jekyll doctor', function(err) {
    return err ? cb(err) : cb();
  });
});

gulp.task('jekyll', ['clean', 'doctor'], function(cb) {
  shell.exec('bundle exec jekyll build', function(err) {
    return err ? cb(err) : cb();
  });
});

gulp.task('jekyll:prod', ['clean', 'doctor'], function(cb) {
  var command = 'bundle exec jekyll build --config _config.yml,_config.production.yml';
  shell.exec(command, function(err) {
    return err ? cb(err) : cb();
  });
});

gulp.task('xml', ['jekyll'], function() {
  return gulp.src(paths.xml)
             .pipe(gulp.dest(paths.dist));
});

gulp.task('xml:prod', ['jekyll:prod'], function() {
  return gulp.src(paths.xml)
             .pipe(gzip())
             .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', ['jekyll'], function() {
  return gulp.src(paths.sass)
             .pipe(sass())
             .pipe(concat('main.css'))
	           .pipe(gulp.dest(paths.dcss))
	           .pipe(browser_sync.stream());
});

gulp.task('styles:prod', ['jekyll:prod'], function() {
  return gulp.src(paths.sass)
             .pipe(sass())
             .pipe(concat('main.css'))
	           .pipe(mincss())
	           .pipe(gzip())
	           .pipe(gulp.dest(paths.dcss));
});

gulp.task('lint', ['jekyll'], function() {
  return gulp.src(paths.js)
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});

gulp.task('lint:prod', ['jekyll:prod'], function() {
  return gulp.src(paths.js)
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['jekyll'], function() {
  return gulp.src(paths.js)
             .pipe(concat('main.js'))
	           .pipe(gulp.dest(paths.djs))
	           .pipe(browser_sync.stream());
});

gulp.task('scripts:prod', ['jekyll:prod'], function() {
  return gulp.src(paths.js)
             .pipe(concat('main.js'))
	           .pipe(uglify())
	           .pipe(gzip())
	           .pipe(gulp.dest(paths.djs));
});

gulp.task('html', ['jekyll'], function() {
  return gulp.src(paths.html)
             .pipe(gulp.dest(paths.dist));
});

gulp.task('html:prod', ['jekyll:prod'], function() {
  return gulp.src(paths.html)
             .pipe(minhtml())
	           .pipe(gzip())
	           .pipe(gulp.dest(paths.dist));
});

gulp.task('build', [
  'html',
  'styles',
  'scripts',
  'xml',
  'lint'
]);

gulp.task('build:prod', [
  'html:prod',
  'styles:prod',
  'scripts:prod',
  'xml:prod',
  'lint:prod',
]);

gulp.task('serve', ['build'], function() {
  browser_sync.init({
    server: {
      baseDir: paths.dist
    }
  });

  gulp.watch(paths.sass, ['styles']);
  gulp.watch(paths.js, ['scripts']);
});

gulp.task('serve:prod', ['build:prod'], function() {
  browser_sync.init({
    server: {
      baseDir: paths.dist
    }
  });

  gulp.watch(paths.sass, ['styles:prod']);
  gulp.watch(paths.js, ['scripts:prod']);
});

gulp.task('default', ['serve']);
