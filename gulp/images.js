//////////////////////////////////////////////////////////////////////
// Images                                                           //
//////////////////////////////////////////////////////////////////////

// Setup
var gulp = require('gulp');
var size = require('gulp-size');
var ico = require('gulp-to-ico');
var svgmin = require('gulp-svgmin');
var responsive = require('gulp-responsive');
var config = require('../build/build.config.js');

// Tasks
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

//// Generate responsive images for the site
gulp.task('images', function() {
	return gulp
		.src(config.responsiveimages)
		.pipe(gulp.dest(config.dist + '/assets/img/site/'))
		.pipe(
			size({
				title: 'img'
			})
		);
});


gulp.task('images:dev', function () {
	return gulp
		.src(config.responsiveimages)
		.pipe(responsive({
			'*': [
				{
					width: 128,
					blur: true,
					quality: 20,
					rename: { suffix: '-load'}
				},
				{
					width: 480,
					rename: { suffix: '-480px' }
				},
				{
					width: 1024,
					rename: { suffix: '-1024px'}
				},
				{
					width: 1920,
					rename: { suffix: '-1920px'}
				},
				{
					width: 2560,
					rename: { suffix: '-2560px'}
				},
				{
					// Compress, strip metadata, and rename original image
					rename: { suffix: '-original' },
				}
			],
		},
		{
			// Global configuration for all images
			// The output quality for JPEG, WebP and TIFF output formats
			quality: 70,
			// Use progressive (interlace) scan for JPEG and PNG output
			progressive: true,
			// Strip all metadata
			withMetadata: false
		}))
		.pipe(gulp.dest(config.dev + '/assets/img/site/'))
});