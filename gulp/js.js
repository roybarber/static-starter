//////////////////////////////////////////////////////////////////////
// JS Minification                                                  //
//////////////////////////////////////////////////////////////////////

// Setup
var gulp = require('gulp');
var config = require('../build/build.config.js');
var uglify = require('gulp-uglify-es').default;

// Tasks
gulp.task('scripts', function() {
    return gulp.src(config.js)
	.pipe(uglify())
    .pipe(gulp.dest(config.dist + '/assets/js/'))
});