//////////////////////////////////////////////////////////////////////
// HTML Build                                                       //
//////////////////////////////////////////////////////////////////////

//// Concat CSS & JS files into single files, adds unique cache busting strings
//// Allows dev/prod if statements to show and hide content based on environment

//Setup
var gulp = require('gulp');
var useref = require('gulp-useref');
var size = require('gulp-size');
var preprocess = require('gulp-preprocess');
var config = require('../build/build.config.js');

// Tasks
// gulp.task('html:dev', function() {
// 	return gulp
// 		.src(config.devhtml)
// 		.pipe(preprocess({ context: { NODE_ENV: 'dev' } }))
// 		.pipe(gulp.dest(config.dev));
// });


gulp.task('html', function() {
	var manifest = gulp.src('build/dist/assets/rev-manifest.json');
	return gulp
		.src(config.html)
		.pipe(
			useref({
				searchPath: '{build,client}'
			})
		)
		.pipe(preprocess({ context: { NODE_ENV: 'prod' } }))
		.pipe(gulp.dest(config.dist))
		.pipe(
			size({
				title: 'html'
			})
		);
});