//////////////////////////////////////////////////////////////////////
// File name revision                                               //
//////////////////////////////////////////////////////////////////////

//Setup
var gulp = require('gulp');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var revDel = require('gulp-rev-delete-original');
var config = require('../build/build.config.js');


// Tasks
gulp.task('revision', function() {
	return gulp
		.src([config.dist + '/assets/{css,js}/**/*'])
		.pipe(rev())
		.pipe(revDel())
		.pipe(gulp.dest(config.dist + '/assets/'))
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.dist + '/assets/'));
});

gulp.task('revisionReplace', function() {
	var manifest = gulp.src(config.dist + '/assets/rev-manifest.json');

	return gulp
		.src(config.dist + '/**/*.html')
		.pipe(revReplace({ manifest: manifest }))
		.pipe(gulp.dest(config.dist));
});