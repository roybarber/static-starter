'use strict';

var config = require('./build/build.config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var notify = require("gulp-notify");
var reload = browserSync.reload;
var pkg = require('./package');
var del = require('del');
var gulpif = require('gulp-if');
var _ = require('lodash');

// optimize images and put them in the dist folder
gulp.task('images', function() {
  return gulp.src(config.images)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(config.dist + '/img'))
    .pipe($.size({
      title: 'img'
    }));
});

//generate css files from scss sources
gulp.task('sass', function() {
  return gulp.src(config.mainScss)
    .pipe($.sass())
    .on('error', $.sass.logError)
    .on("error", notify.onError({
        title: 'SASS ERROR',
		message: '<%= error.message %>',
		sound: true
    }))
    .pipe(gulp.dest(config.tmp))
    //.pipe(notify({
    //    title: 'SUCCESS!',
	//	message: 'Generated: <%= file.relative %>',
	//	sound: true
    //}))
    .pipe($.size({
      title: 'sass'
    }));
});

//build files for creating a dist release
gulp.task('build:dist', ['clean'], function(cb) {
  runSequence(['build', 'copy', 'copy:assets', 'images'], 'html', cb);
});

//build files for development
gulp.task('build', ['clean'], function(cb) {
  runSequence(['sass'], cb);
});

//generate a minified css files, 2 js file, change theirs name to be unique, and generate sourcemaps
gulp.task('html', function() {
  var assets = $.useref.assets({
    searchPath: '{build,client}'
  });

  return gulp.src(config.index)
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({
      mangle: false,
    })))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(['**/*main.js', '**/*main.css'], $.header(config.banner, {
      pkg: pkg
    })))
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe($.if('*.html', $.minifyHtml({empty: true})))
    .pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'html'
    }));
});

//copy assets in dist folder
gulp.task('copy:assets', function() {
  return gulp.src(config.assets, {
      dot: true
    }).pipe(gulp.dest(config.dist + '/assets'))
    .pipe($.size({
      title: 'copy:assets'
    }));
});

//copy assets in dist folder
gulp.task('copy', function() {
  return gulp.src([
      config.base + '/*',
      '!' + config.base + '/*.html',
      '!' + config.base + '/src'
    ]).pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'copy'
    }));
});


//clean temporary directories
gulp.task('clean', del.bind(null, [config.dist, config.tmp]));

//default task
gulp.task('default', ['serve']);

//run the server after having built generated files, and watch for changes
gulp.task('serve', ['build'], function() {
  browserSync({
    notify: false,
    logPrefix: pkg.name,
    server: ['build', 'client']
  });
  gulp.watch(config.html, reload);
  gulp.watch(config.scss, ['sass', reload]);
  gulp.watch(config.assets, reload);
});

//run the app packed in the dist folder
gulp.task('serve:dist', ['build:dist'], function() {
  browserSync({
    notify: false,
    server: [config.dist]
  });
});
