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
		'build/dist/scss',
		'build/dist/js',
		'build/dist/vendor',
		'build/dev',
		'build/tmp',
		'build/dist/img/fav',
		'build/dist/site-config'
	])
);

//// Remove partials from live
gulp.task('clean:partials', del.bind(null, ['build/dist/partials']));

//// Remove manifest from live
gulp.task(
	'clean:manifest',
	del.bind(null, ['build/dist/assets/rev-manifest.json'])
);
