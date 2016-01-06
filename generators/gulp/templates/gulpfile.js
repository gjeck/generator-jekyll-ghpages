'use strict';
var gulp         = require('gulp'),
    browser_sync = require('browser-sync').create(),
    shell        = require('shelljs'),
    sass         = require('gulp-sass'),
    mincss       = require('gulp-cssnano'),
    minhtml      = require('gulp-htmlmin'),
    concat       = require('gulp-concat'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    ginject      = require('gulp-inject'),
    imagemin     = require('gulp-imagemin'),
    yaml         = require('js-yaml'),
    fs           = require('fs'),
    del          = require('del'),
    gchanged     = require('gulp-changed'),
    gh_pages     = require('gulp-gh-pages');

var paths = {
  scss:   ['app/assets/css/**/*.scss'],
  js:     ['app/assets/js/**/*.js'],
  images: ['app/assets/images/*'],
  fonts:  ['app/assets/fonts/*'],
  html:   ['app/**/*.html'],
  xml:    ['app/**/*.xml'],
  yml:    ['app/**/*.yml'],
  md:     ['app/**/*.md', 'app/**/*.markdown'],
  jhtml:  ['.jekyll_tmp/**/*.html'],
  jxml:   ['.jekyll_tmp/**/*.xml'],
  tmp:    '.jekyll_tmp/',
  ymldev: '_config.yml',
  ymlprd: '_config.production.yml',
  dist:   '.dist/',
  dcss:   '.dist/assets/css/',
  djs:    '.dist/assets/js/',
  dfonts: '.dist/assets/fonts/',
  dimages:'.dist/assets/images/',
  dall:   '.dist/**/*',
};

var vendor_paths = {
  scss: function() {
    try {
      var config = yaml.safeLoad(fs.readFileSync(paths.ymldev, 'utf8'));
      return config.vendor.scss_paths || [];
    } catch (err) {
      return [];
    }
  },
  js: function() {
    try {
      var config = yaml.safeLoad(fs.readFileSync(paths.ymldev, 'utf8'));
      return config.vendor.js_paths || [];
    } catch (err) {
      return [];
    }
  },
};

gulp.task('clean:soft', function() {
  return del([paths.dist]);
});

gulp.task('jekyll:doctor', function(cb) {
  shell.exec('bundle exec jekyll doctor', function(err) {
    return err ? cb(err) : cb();
  });
});

gulp.task('jekyll:clean', function(cb) {
  shell.exec('bundle exec jekyll clean', function(err) {
    return err ? cb(err) : cb();
  });
});

gulp.task('clean', ['clean:soft', 'jekyll:clean']);

gulp.task('jekyll', function(cb) {
  shell.exec('bundle exec jekyll build --incremental', function(err) {
    return err ? cb(err) : cb();
  });
});

gulp.task('jekyll:prod', ['clean'], function(cb) {
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
             .pipe(gulp.dest(paths.dist));
});

gulp.task('styles', ['jekyll'], function() {
  return gulp.src(paths.scss)
             .pipe(sass())
             .pipe(concat('main.css'))
             .pipe(gulp.dest(paths.dcss))
             .pipe(browser_sync.stream());
});

gulp.task('styles:prod', ['jekyll:prod'], function() {
  return gulp.src(paths.scss)
             .pipe(sass())
             .pipe(concat('main.css'))
             .pipe(mincss())
             .pipe(gulp.dest(paths.dcss));
});

gulp.task('vendor:styles', ['jekyll'], function() {
  return gulp.src(vendor_paths.scss())
             .pipe(sass())
             .pipe(concat('_vendor.css'))
             .pipe(gulp.dest(paths.dcss))
             .pipe(browser_sync.stream());
});

gulp.task('vendor:styles:prod', ['jekyll:prod'], function() {
  return gulp.src(vendor_paths.scss())
             .pipe(sass())
             .pipe(concat('_vendor.css'))
             .pipe(mincss())
             .pipe(gulp.dest(paths.dcss));
});

gulp.task('lint', function() {
  return gulp.src(paths.js)
             .pipe(jshint())
             .pipe(jshint.reporter('default'));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
             .pipe(gchanged(paths.dfonts))
             .pipe(gulp.dest(paths.dfonts));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
             .pipe(gchanged(paths.dimages))
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
             .pipe(gulp.dest(paths.djs));
});

gulp.task('vendor:scripts', ['jekyll'], function() {
  return gulp.src(vendor_paths.js())
             .pipe(concat('_vendor.js'))
             .pipe(gulp.dest(paths.djs))
             .pipe(browser_sync.stream());
});

gulp.task('vendor:scripts:prod', ['jekyll:prod'], function() {
  return gulp.src(vendor_paths.js())
             .pipe(concat('_vendor.js'))
             .pipe(uglify())
             .pipe(gulp.dest(paths.djs));
});

gulp.task('inject', ['styles', 'scripts'], function() {
  var target = gulp.src(paths.jhtml);
  var source_paths = [paths.dcss + '*.css', paths.djs + '*.js'];
  var source = gulp.src(source_paths, { read: false });
  var options = {
    ignorePath: paths.dist
  };
  return target.pipe(ginject(source, options))
               .pipe(gulp.dest(paths.tmp));
});

gulp.task('inject:prod', ['styles:prod', 'scripts:prod'], function(cb) {
  try {
    var config = yaml.safeLoad(fs.readFileSync(paths.ymlprd, 'utf8'));
    var baseurl = config.baseurl || '';
    var target = gulp.src(paths.jhtml);
    var source_paths = [paths.dcss + '*.css', paths.djs + '*.js'];
    var source = gulp.src(source_paths, { read: false });
    var options = {
      addPrefix: baseurl,
      ignorePath: paths.dist
    };
    return target.pipe(ginject(source, options))
                 .pipe(gulp.dest(paths.tmp));
  } catch (err) {
    return cb(err);
  }
});

gulp.task('html', ['jekyll', 'inject'], function() {
  return gulp.src(paths.jhtml)
             .pipe(gulp.dest(paths.dist));
});

gulp.task('html:prod', ['jekyll:prod', 'inject:prod'], function() {
  return gulp.src(paths.jhtml)
             .pipe(minhtml({
               removeComments: true,
               collapseWhitespace: true,
               collapseBooleanAttributes: true,
               removeRedundantAttributes: true
             }))
             .pipe(gulp.dest(paths.dist));
});

gulp.task('build', [
  'html',
  'styles',
  'vendor:styles',
  'scripts',
  'vendor:scripts',
  'xml',
  'lint',
  'fonts',
  'images',
  'inject'
]);

gulp.task('build:prod', [
  'html:prod',
  'styles:prod',
  'vendor:styles:prod',
  'scripts:prod',
  'vendor:scripts:prod',
  'xml:prod',
  'lint',
  'fonts',
  'images',
  'inject:prod'
]);

var browser_sync_delay = 200;
gulp.task('live-reload', ['build'], function(cb) {
  setTimeout(function() {
    browser_sync.reload();
    cb();
  }, browser_sync_delay);
});

gulp.task('serve', ['build'], function() {
  browser_sync.init({
    server: {
      injectChanges: true,
      baseDir: paths.dist,
      reloadDelay: browser_sync_delay,
      reloadDebounce: browser_sync_delay,
    }
  });

  gulp.watch(paths.scss, ['styles']);
  gulp.watch(paths.js, ['scripts']);
  gulp.watch([paths.yml, paths.html, paths.md], ['live-reload']);
});

gulp.task('default', ['serve']);

var deploy_branch = '<%= branch_name %>';
gulp.task('deploy', ['build:prod'], function() {
  return gulp.src(paths.dall)
             .pipe(gh_pages({ branch: deploy_branch }));
});
