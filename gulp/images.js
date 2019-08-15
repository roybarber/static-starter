//////////////////////////////////////////////////////////////////////
// Images                                                           //
//////////////////////////////////////////////////////////////////////

// Setup
var gulp = require('gulp');
var size = require('gulp-size');
var ico = require('gulp-to-ico');
var svgmin = require('gulp-svgmin');
var config = require('../build/build.config.js');

// Tasks
//// optimize images and put them in the dist folder
gulp.task('images', function() {
	return gulp
		.src(config.images)
		.pipe(gulp.dest(config.dist + '/img'))
		.pipe(
			size({
				title: 'img'
			})
		);
});

//// Create the favicon from the png
gulp.task('favicon', ['copy:fav'], function() {
	return gulp
		.src(config.dist + '/favicon.png')
		.pipe(ico('favicon.ico'))
		.pipe(gulp.dest(config.dist));
});

//// Create the favicon from the png
gulp.task('favicon:dev', ['copy:fav'], function() {
	return gulp
		.src(config.dist + '/favicon.png')
		.pipe(ico('favicon.ico'))
		.pipe(gulp.dest(config.dev));
});

// Minify SVG's
gulp.task('svg', function(){
	return gulp.src(config.icons + '.svg')
        .pipe(svgmin())
        //.pipe(gulp.dest(config.icons));
});