//////////////////////////////////////////////////////////////////////
// Builds                                                           //
//////////////////////////////////////////////////////////////////////

// Setup
var gulp = require('gulp');
var runSequence = require('run-sequence');

// Tasks
//// Build files for creating a dist release for production
gulp.task('build:dist', ['clean'], function(cb) {
	runSequence(
		//['images'],
		//['copy:images'],
		['svg', 'sass:dist', 'images'],
		//['build:dev'],
		['panini'],
		['copy', 'copy:assets'],
        ['scripts'],
		['revision'],
		['revisionReplace'],
		'favicon',
		['html'],
		'clean:dist',
		cb
	);
});

//// Build files for local development
gulp.task('build:dev', ['clean'], function(cb) {
	runSequence(
		['svg'],
		['sass', 'copy:dev', 'images'],
		['copy:images'],
		['panini:dev'],
		cb
	);
});