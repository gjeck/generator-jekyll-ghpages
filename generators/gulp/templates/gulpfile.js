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
    imagemin = require('gulp-imagemin'),
    grev = require('gulp-rev'),
    del = require('del');

var vendor_paths = {
  sass:   [],
  css:    [],
  js:     [],
  images: [],
  fonts:  []
};

var paths = {
  sass:   ['app/assets/css/**/*.scss'],
  js:     ['app/assets/js/**/*.js'],
  images: ['app/assets/images/*'],
  fonts:  ['app/assets/fonts/*'],
  html:   ['app/**/*.html'],
  xml:    ['app/**/*.xml'],
  yml:    ['app/**/*.yml'],
  md:     ['app/**/*.md'],
  txt:    ['app/**/*.txt'],
  jhtml:  ['.jekyll_tmp/**/*.html'],
  jxml:   ['.jekyll_tmp/**/*.xml'],
  tmp:    '.jekyll_tmp/',
  dist:   '.dist/',
  dcss:   '.dist/assets/css/',
  djs:    '.dist/assets/js/',
  dfonts: '.dist/assets/fonts/',
  dimages:'.dist/assets/images/',
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
  return gulp.src(paths.jxml)
             .pipe(gulp.dest(paths.dist));
});

gulp.task('xml:prod', ['jekyll:prod'], function() {
  return gulp.src(paths.jxml)
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
	     .pipe(grev())
	     .pipe(gulp.dest(paths.dcss));
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
             .pipe(gulp.dest(paths.dfonts));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
	     .pipe(imagemin({ progressive: true }))
	     .pipe(gulp.dest(paths.dimages));
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
	     .pipe(grev())
	     .pipe(gulp.dest(paths.djs));
});

gulp.task('html', ['jekyll'], function() {
  return gulp.src(paths.jhtml)
             .pipe(gulp.dest(paths.dist));
});

gulp.task('html:prod', ['jekyll:prod'], function() {
  return gulp.src(paths.jhtml)
             .pipe(minhtml())
	     .pipe(gzip())
	     .pipe(gulp.dest(paths.dist));
});

gulp.task('build', [
  'html',
  'styles',
  'scripts',
  'xml',
  'lint',
  'fonts',
  'images'
]);

gulp.task('build:prod', [
  'html:prod',
  'styles:prod',
  'scripts:prod',
  'xml:prod',
  'lint',
  'fonts',
  'images'
]);

gulp.task('serve', ['build'], function() {
  browser_sync.init({
    server: {
      baseDir: paths.dist
    }
  });

  gulp.watch(paths.sass, ['styles']);
  gulp.watch(paths.js, ['scripts']);
  gulp.watch([paths.yml, paths.html, paths.md, paths.txt], ['build']);
});

gulp.task('default', ['serve']);
