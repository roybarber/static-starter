//////////////////////////////////////////////////////////////////////
// Handlebars                                                       //
//////////////////////////////////////////////////////////////////////

// Setup
var gulp = require('gulp');
var fs = require('fs');
var handlebars = require('gulp-compile-handlebars');
var jsonminify = require('gulp-jsonminify');
var config = require('../build/build.config.js');


var hbOptions = {
	ignorePartials: true,
	batch: [config.base + config.partials],
	helpers: {}
};
var hbOptionsDist = {
	ignorePartials: true,
	batch: [config.dist + config.partials],
	helpers: {}
};

// Tasks
gulp.task('minifyjson', function() {
	return gulp
		.src(['./variables.js'])
		.pipe(jsonminify())
		.pipe(gulp.dest('json'));
});

//// Inject Handlebar varibles for development
gulp.task('inject:dev', ['minifyjson'], function(cb) {
	return gulp
		.src(config.html)
		.pipe(
			handlebars(
				JSON.parse(fs.readFileSync('./json/variables.js')),
				hbOptions
			)
		)
		.pipe(gulp.dest(config.dev));
});

//// Inject Handlebar varibles for production
gulp.task('inject:dist', ['minifyjson'], function(cb) {
	return gulp
		.src(config.dist + '/**/*.html')
		.pipe(
			handlebars(
				JSON.parse(fs.readFileSync('./json/variables.js')),
				hbOptionsDist
			)
		)
		.pipe(gulp.dest(config.dist));
});
