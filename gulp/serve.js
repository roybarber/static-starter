//////////////////////////////////////////////////////////////////////
// Local development server                                         //
//////////////////////////////////////////////////////////////////////

//// Run the development server after having built generated files, and watch for changes

// Setup
var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var config = require('../build/build.config.js');


// Tasks
//// Development
gulp.task('serve', function() {
	runSequence('build', 'minifyjson', 'inject:dev', 'html:dev', 'favicon:dev', function() {
		browserSync({
			notify: true,
			server: ['build', config.dev]
		});
	});
	gulp.watch(config.html, ['inject:dev', reload], ['html:dev', reload]);
	gulp.watch(config.json, ['inject:dev', reload]);
	gulp.watch(config.scss, ['sass', reload]);
	gulp.watch(
        [config.base + '/**/*', '!' + config.html, '!' + config.scss],
		['copy:dev:assets', reload]
    );
});

//// Run the prod site packed in the dist folder
gulp.task('serve:dist', ['build:dist'], function() {
	browserSync({
		notify: false,
		server: [config.dist]
	});
});