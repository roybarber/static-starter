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
		['build', 'copy', 'copy:assets', 'images', 'panini'],
        ['html'],
        ['scripts'],
		['revision'],
		['revisionReplace'],
		'favicon',
		'clean:dist',
		cb
	);
});

//// Build files for local development
gulp.task('build', ['clean'], function(cb) {
	runSequence(['svg'], ['sass:dist', 'copy:dev', 'panini:dev'], cb);
});