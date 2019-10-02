//////////////////////////////////////////////////////////////////////
// SASS to CSS                                                      //
//////////////////////////////////////////////////////////////////////

//// Sass compilation, sourcemaps, autoprefixing and minification

// Setup
var gulp = require('gulp');
var notify = require('gulp-notify');
var size = require('gulp-size');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../build/build.config.js');

// Tasks
gulp.task('sass', function() {
	return gulp
		.src(config.mainScss)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', sass.logError)
		.on(
			'error',
			notify.onError({
				title: 'SASS ERROR',
				message: '<%= error.message %>',
				sound: true
			})
		)
		.pipe(
			autoprefixer({
				browsers: ['last 3 versions'],
				cascade: false
			})
		)
		.pipe(notify({title: "SASS Compiled", message: "CSS comiled to <%= file.relative %>"}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(config.dev + '/assets/css'))
		.pipe(
			size({
				title: 'sass'
			})
		)
});
gulp.task('sass:dist', function() {
	return gulp
		.src(config.mainScss)
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(
			autoprefixer({
				browsers: ['last 3 versions'],
				cascade: false
			})
		)
		.pipe(gulp.dest(config.dist + '/assets/css'))
		.pipe(
			size({
				title: 'sass'
			})
		);
});