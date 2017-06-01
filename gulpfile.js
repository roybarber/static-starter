'use strict';

var fs = require('fs');
var request = require('sync-request');
var config = require('./build/build.config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var reload = browserSync.reload;
var pkg = require('./package');
var del = require('del');
var gulpif = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var _ = require('lodash');
var inject = require('gulp-inject-string');
var devConfig = JSON.parse(fs.readFileSync('./variables.json'));
var liveConfig = JSON.parse(request('GET', config.config_url).getBody());
var ico = require('gulp-to-ico');
var run = require('gulp-run-command').default;

// optimize images and put them in the dist folder
gulp.task('images', function() {
  return gulp.src(config.images)
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
    .pipe($.size({
      title: 'sass'
    }));
});
gulp.task('sass:dist', function() {
  return gulp.src(config.mainScss)
    .pipe($.sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'sass'
    }));
});

//build files for creating a dist release
gulp.task('build:dist', ['clean'], function(cb) {
  runSequence(['build', 'copy', 'copy:assets', 'images'], 'html', 'favicon', 'clean:dist', 'inject:prod', cb);
});

//build files for development
gulp.task('build', ['clean'], function(cb) {
  runSequence(['sass:dist', 'copy:dev'], cb);
});

//generate a minified css files, 2 js file, change theirs name to be unique, and generate sourcemaps
gulp.task('html', function() {
  var assets = $.useref.assets({
    searchPath: '{build,client}'
  });

  return gulp.src(config.html)
    .pipe(assets)
    //.pipe($.if('*.js', $.uglify({
    //  mangle: false,
    //})))
    //.pipe($.if('*.css', cleanCSS()))
    .pipe($.if(['**/*main.js', '**/*main.css'], $.header(config.banner, {
      pkg: pkg
    })))
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'html'
    }));
});

//copy assets in dist folder
gulp.task('copy:assets', function() {
  return gulp.src(config.assets, {
      dot: true
    }).pipe(gulp.dest(config.dist))
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

//copy assets in dev folder
gulp.task('copy:dev', function() {
  return gulp.src([
      config.base + '/**/*',
      '!' + config.base + '/src'
    ]).pipe(gulp.dest(config.dev))
    .pipe($.size({
      title: 'copy'
    }));
});

// Copy dev assets
gulp.task('copy:dev:assets', function() {
  return gulp.src([
      config.base + '/**/*',
      '!' + config.base + '/src',
      '!' + config.base + '/**/*.html'
    ]).pipe(gulp.dest(config.dev))
    .pipe($.size({
      title: 'copy'
    }));
});

// Create the favicon from the png
gulp.task('favicon', ['copy:fav'], function() {
  return gulp.src(config.dist + '/favicon.png')
    .pipe(ico('favicon.ico'))
    .pipe(gulp.dest(config.dist));
});
//copy over the social assets and place them in the root of the dist
gulp.task('copy:fav', function() {
  return gulp.src([
      config.base + '/img/fav/*',
      config.base + '/site-config/*'
    ]).pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'copy:fav'
    }));
});

//clean temporary directories
gulp.task('clean', del.bind(null, [config.dev, config.tmp]));
// Clean build transfered folders
gulp.task('clean:dist', del.bind(null, [
  'build/dist/scss',
  'build/dist/js',
  'build/dist/vendor',
  'build/dev',
  'build/tmp',
  'build/dist/img/fav',
  'build/dist/site-config'
]));

//run the server after having built generated files, and watch for changes
gulp.task('serve', function() {
	runSequence('build', 'inject:dev', function() {
		browserSync({
			notify: false,
			logPrefix: pkg.name,
			server: ['build', config.dev]
		});
	});
	gulp.watch(config.html, ['inject:dev', reload]);
	gulp.watch(config.scss, ['sass', reload]);
	gulp.watch([config.base + '/**/*', '!' + config.html, '!' + config.scss], ['copy:dev:assets', reload]);
});

// Inject JSON Varibles
gulp.task('inject:dev', function(cb) {
  var keys = _.keys(devConfig);
  var stream = gulp.src(config.html);

  for(var i = 0; i < keys.length; i++) {
    stream = stream.pipe(inject.replace('<% ' + keys[i] + ' %>', devConfig[keys[i]]));
  }

  stream = stream.pipe(gulp.dest(config.dev));

  setTimeout(cb, 100);
});

// Inject JSON Varibles for Production
gulp.task('inject:prod', function(cb) {
  var keys = _.keys(liveConfig);
  var stream = gulp.src(config.dist + '/**/*.html');

  for(var i = 0; i < keys.length; i++) {
    stream = stream.pipe(inject.replace('<% ' + keys[i] + ' %>', liveConfig[keys[i]]));
  }

  stream = stream.pipe(gulp.dest(config.dist));

  setTimeout(cb, 100);
});

//run the app packed in the dist folder
gulp.task('serve:dist', ['build:dist'], function() {
  browserSync({
    notify: false,
    server: [config.dist]
  });
});

//default task
gulp.task('default', ['serve']);

// Export contents of sketch file
gulp.task('sketch', run('sketchtool export slices --compact=YES --save-for-web=YES sketch/static-starter-v2.sketch --output=client/img'))