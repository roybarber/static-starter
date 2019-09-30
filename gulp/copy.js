// //////////////////////////////////////////////////////////////////////
// // Copy                                                             //
// //////////////////////////////////////////////////////////////////////

// Setup
var gulp = require('gulp');
var size = require('gulp-size');
var config = require('../build/build.config.js');

// Tasks
//// Copy assets in dev folder
gulp.task('copy:dev', function() {
	return gulp
		.src([config.base + '/**/*', '!' + config.base + '/src'])
		.pipe(gulp.dest(config.dev))
		.pipe(
			size({
				title: 'copy'
			})
		);
});

// Copy dev assets
gulp.task('copy:dev:assets', function() {
	return gulp
		.src([
			config.base + '/**/*',
			'!' + config.base + '/src',
			'!' + config.base + '/**/*.html'
		])
		.pipe(gulp.dest(config.dev))
		.pipe(
			size({
				title: 'copy'
			})
		);
});

//// Copy assets in dist folder
gulp.task('copy', function() {
	return gulp
		.src([
			config.base + '/*',
			'!' + config.base + '/*.html',
			'!' + config.base + '/src'
		])
		.pipe(gulp.dest(config.dist))
		.pipe(
			size({
				title: 'copy'
			})
		);
});

//// Copy assets in dist folder
gulp.task('copy:assets', function() {
	return gulp
		.src(config.assets, {
			dot: true
		})
		.pipe(gulp.dest(config.dist + '/assets'))
		.pipe(
			size({
				title: 'copy:assets'
			})
		);
});

//// Copy over the social and site config assets and place them in the root of the dist
gulp.task('copy:fav', function() {
	return gulp
		.src([config.base + '/assets/img/fav/*', config.base + '/assets/site-config/*'])
		.pipe(gulp.dest(config.dist))
		.pipe(
			size({
				title: 'copy:fav'
			})
		);
});