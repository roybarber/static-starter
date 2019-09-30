//////////////////////////////////////////////////////////////////////
// Email Generation                                                 //
//////////////////////////////////////////////////////////////////////

// Setup
// var gulp = require('gulp');
// var runSequence = require('run-sequence');
// var browserSync = require('browser-sync');
// var reload = browserSync.reload;
// var size = require('gulp-size');
// var config = require('../build/build.config.js');

// // Tasks
// //// Email generation development server
// gulp.task('email', function() {
// 	runSequence('build:email', function() {
// 		browserSync({
// 			notify: true,
// 			server: ['build:email', config.dev]
// 		});
// 	});
// 	gulp.watch(
// 		config.emailHtml,
// 		['build:email', reload]
// 	);
// 	gulp.watch(
// 		config.email + '/img/**/*',
// 		['build:email', reload]
// 	);
// });


// // Copy the genrated html templates but not the source
// gulp.task('copy:email', function() {
// 	return gulp
// 		.src([config.email + '/**/*'])
// 		.pipe(gulp.dest(config.dev))
// 		.pipe(
// 			size({
// 				title: 'copy email'
// 			})
// 		);
// });

// // Clean the dev folder then copy over the generated html
// gulp.task('build:email', ['clean'], function(cb) {
// 	runSequence(['copy:email'], cb);
// });