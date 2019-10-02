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
		['build', 'copy', 'copy:assets', 'images', 'images:dev'],
		['panini'],
        //['html'],
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
gulp.task('build', ['clean'], function(cb) {
	runSequence(['svg'], ['sass:dist', 'copy:dev', 'images:dev'],['panini:dev'], cb);
});