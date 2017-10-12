'use strict';

//////////////////////////////////////////////////////////////////////
// Plugins                                                          //
//////////////////////////////////////////////////////////////////////

var gulp = require('gulp');
var fs = require('fs');
var request = require('sync-request');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var notify = require('gulp-notify');
var del = require('del');
var useref = require('gulp-useref');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var revDel = require('gulp-rev-delete-original');
var size = require('gulp-size');
var critical = require('critical');
var ico = require('gulp-to-ico');
var run = require('gulp-run-command').default;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var preprocess = require('gulp-preprocess');
var handlebars = require('gulp-compile-handlebars');


//////////////////////////////////////////////////////////////////////
// Setup                                                            //
//////////////////////////////////////////////////////////////////////
var config = require('./build/build.config.js');
var templateData = JSON.parse(fs.readFileSync('./variables.js'));


//////////////////////////////////////////////////////////////////////
// Sketch                                                           //
//////////////////////////////////////////////////////////////////////

//// Export assets from sketch file
gulp.task('sketch', run('sketchtool export slices --compact=YES --save-for-web=YES sketch/static-starter-v2.sketch --output=client/img'))


//////////////////////////////////////////////////////////////////////
// Handlebars                                                       //
//////////////////////////////////////////////////////////////////////

var hbOptions = {
  ignorePartials: true,
  batch : [config.base + config.partials],
  helpers : {}
};
var hbOptionsDist = {
  ignorePartials: true,
  batch : [config.dist + config.partials],
  helpers : {}
};

//// Inject Handlebar varibles for development
gulp.task('inject:dev', function(cb) {
  return gulp.src(config.html)
    .pipe(handlebars(templateData, hbOptions))
    .pipe(gulp.dest(config.dev));
});

//// Inject Handlebar varibles for production
gulp.task('inject:dist', function(cb) {
  return gulp.src(config.dist + '/**/*.html')
    .pipe(handlebars(templateData, hbOptionsDist))
    .pipe(gulp.dest(config.dist));
});


//////////////////////////////////////////////////////////////////////
// Images                                                           //
//////////////////////////////////////////////////////////////////////

//// optimize images and put them in the dist folder
gulp.task('images', function() {
  return gulp.src(config.images)
    .pipe(gulp.dest(config.dist + '/img'))
    .pipe(size({
      title: 'img'
    }));
});

//// Create the favicon from the png
gulp.task('favicon', ['copy:fav'], function() {
  return gulp.src(config.dist + '/favicon.png')
    .pipe(ico('favicon.ico'))
    .pipe(gulp.dest(config.dist));
});


//////////////////////////////////////////////////////////////////////
// SASS to CSS                                                      //
//////////////////////////////////////////////////////////////////////

//// Sass compilation, sourcemaps, autoprefixing and minification
gulp.task('sass', function() {
  return gulp.src(config.mainScss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .on("error", notify.onError({
        title: 'SASS ERROR',
    message: '<%= error.message %>',
    sound: true
    }))
    .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.tmp))
    .pipe(size({
      title: 'sass'
    }));
});
gulp.task('sass:dist', function() {
  return gulp.src(config.mainScss)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(config.tmp))
    .pipe(size({
      title: 'sass'
    }));
});


//////////////////////////////////////////////////////////////////////
// Critical CSS                                                     //
//////////////////////////////////////////////////////////////////////

//// Grabs the critical CSS for a page load and inserts it above the page
gulp.task('critical', function () {
    return critical.generate({
        inline: true,
        base: './build/dist/',
        src: 'index.html',
        dest: 'index.html',
        width: 1300,
        height: 1000,
        minify: true
    });
});

//////////////////////////////////////////////////////////////////////
// Run the REV                                                      //
//////////////////////////////////////////////////////////////////////

gulp.task('revision', function(){
  return gulp.src([config.dist + '/assets/**/*'])
    .pipe(rev())
    .pipe(revDel())
    .pipe(gulp.dest(config.dist + '/assets/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.dist + '/assets/'));
});

gulp.task('revisionReplace', function(){
  var manifest = gulp.src(config.dist + "/assets/rev-manifest.json");

  return gulp.src(config.dist + '/**/*.html')
  .pipe(revReplace({manifest: manifest}))
  .pipe(gulp.dest(config.dist));
});

//////////////////////////////////////////////////////////////////////
// HTML Build                                                       //
//////////////////////////////////////////////////////////////////////

//// Concat CSS & JS files into single files, adds unique cache busting strings
//// Allows dev/prod if statements to show and hide content based on environment
gulp.task('html:dev', function() {
  return gulp.src(config.devhtml)
  .pipe(preprocess({context: { NODE_ENV: 'dev'}}))
  .pipe(gulp.dest(config.dev))
});
gulp.task('html', function() {
  var manifest = gulp.src("build/dist/assets/rev-manifest.json");

  return gulp.src(config.html)
  .pipe(useref({
    searchPath: '{build,client}'
  }))
  .pipe(preprocess({context: { NODE_ENV: 'prod'}}))
  .pipe(gulp.dest(config.dist))
  .pipe(size({
    title: 'html'
  }));
});


//////////////////////////////////////////////////////////////////////
// Copy                                                             //
//////////////////////////////////////////////////////////////////////

//// Copy assets in dev folder
gulp.task('copy:dev', function() {
  return gulp.src([
    config.base + '/**/*',
    '!' + config.base + '/src'
  ])
  .pipe(gulp.dest(config.dev))
  .pipe(size({
    title: 'copy'
  }));
});

// Copy dev assets
gulp.task('copy:dev:assets', function() {
  return gulp.src([
    config.base + '/**/*',
    '!' + config.base + '/src',
    '!' + config.base + '/**/*.html'
  ])
  .pipe(gulp.dest(config.dev))
  .pipe(size({
    title: 'copy'
  }));
});

//// Copy assets in dist folder
gulp.task('copy', function() {
  return gulp.src([
    config.base + '/*',
    '!' + config.base + '/*.html',
    '!' + config.base + '/src'
  ])
  .pipe(gulp.dest(config.dist))
  .pipe(size({
    title: 'copy'
  }));
});

//// Copy assets in dist folder
gulp.task('copy:assets', function() {
  return gulp.src(config.assets, {
    dot: true
  })
  .pipe(gulp.dest(config.dist))
  .pipe(size({
    title: 'copy:assets'
  }));
});

//// Copy over the social and site config assets and place them in the root of the dist
gulp.task('copy:fav', function() {
  return gulp.src([
    config.base + '/img/fav/*',
    config.base + '/site-config/*'
  ])
  .pipe(gulp.dest(config.dist))
  .pipe(size({
    title: 'copy:fav'
  }));
});


//////////////////////////////////////////////////////////////////////
// Clean                                                            //
//////////////////////////////////////////////////////////////////////

//// Clean temporary directories
gulp.task('clean', del.bind(null, [config.dev, config.tmp]));

//// Clean build transfered folders
gulp.task('clean:dist', del.bind(null, [
  'build/dist/scss',
  'build/dist/js',
  'build/dist/vendor',
  'build/dev',
  'build/tmp',
  'build/dist/img/fav',
  'build/dist/site-config'
]));

//// Remove partials from live
gulp.task('clean:partials', del.bind(null, [
  'build/dist/partials'
]));

//// Remove manifest from live
gulp.task('clean:manifest', del.bind(null, [
  'build/dist/assets/rev-manifest.json'
]));


//////////////////////////////////////////////////////////////////////
// Builds                                                           //
//////////////////////////////////////////////////////////////////////

//// Build files for creating a dist release for production
gulp.task('build:dist', ['clean'], function(cb) {
  runSequence(['build', 'copy', 'copy:assets', 'images'], ['html'], ['revision'], ['revisionReplace'], 'favicon', 'clean:dist', 'inject:dist', 'critical', 'clean:partials', 'clean:manifest', cb);
});

//// Build files for local development
gulp.task('build', ['clean'], function(cb) {
  runSequence(['sass:dist', 'copy:dev'], cb);
});


//////////////////////////////////////////////////////////////////////
// Local server                                                     //
//////////////////////////////////////////////////////////////////////

//// Run the development server after having built generated files, and watch for changes
gulp.task('serve', function() {
  runSequence('build', 'inject:dev', 'html:dev', function() {
    browserSync({
      notify: false,
      server: ['build', config.dev]
    });
  });
  gulp.watch(config.html, ['inject:dev'], ['html:dev', reload]);
  gulp.watch(config.scss, ['sass', reload]);
  gulp.watch([config.base + '/**/*', '!' + config.html, '!' + config.scss], ['copy:dev:assets', reload]);
});

//// Run the prod site packed in the dist folder
gulp.task('serve:dist', ['build:dist'], function() {
  browserSync({
    notify: false,
    server: [config.dist]
  });
});


//////////////////////////////////////////////////////////////////////
// Tasks                                                            //
//////////////////////////////////////////////////////////////////////

//// Default task
gulp.task('default', ['serve']);