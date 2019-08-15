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
		['build', 'copy', 'copy:assets', 'copy:video', 'copy:fonts', 'images'],
        ['html'],
        ['scripts'],
		['revision'],
		['revisionReplace'],
		'favicon',
		'clean:dist',
		'inject:dist',
		'clean:partials',
		'clean:manifest',
		cb
	);
});

//// Build files for local development
gulp.task('build', ['clean'], function(cb) {
	runSequence(['svg'], ['sass:dist', 'copy:dev'], cb);
});