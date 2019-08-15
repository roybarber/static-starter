//////////////////////////////////////////////////////////////////////
// JS Minification                                                  //
//////////////////////////////////////////////////////////////////////

// Setup
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var config = require('../build/build.config.js');

// Tasks
gulp.task('scripts', function() {
    return gulp.src(config.js)
    .pipe(uglify())
    .pipe(gulp.dest(config.dist + '/assets/js/'))
});