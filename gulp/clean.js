//////////////////////////////////////////////////////////////////////
// Clean                                                            //
//////////////////////////////////////////////////////////////////////

// Setup
var gulp = require('gulp');
var del = require('del');
var config = require('../build/build.config.js');

// Tasks
//// Clean temporary directories
gulp.task('clean', del.bind(null, [config.dev, config.tmp, config.dist]));

//// Clean build transfered folders
gulp.task(
	'clean:dist',
	del.bind(null, [
		'build/dev',
		'build/tmp',
		'build/dist/assets/rev-manifest.json',
		'build/dist/assets/scss',
		'build/dist/assets/vendor',
		'build/dist/assets/site-config',
		'build/dist/data',
		'build/dist/helpers',
		'build/dist/layouts',
		'build/dist/pages',
		'build/dist/partials'
	])
);