'use strict';

// Setups
var gulp = require('gulp');
var config = require('./build/build.config.js');
var size = require('gulp-size');
var del = require('del');
const runSequence = require('gulp4-run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var panini = require('panini');
var notify = require('gulp-notify');
var useref = require('gulp-useref');
var preprocess = require('gulp-preprocess');
var ico = require('gulp-to-ico');
var svgmin = require('gulp-svgmin');
var responsive = require('gulp-responsive');
var uglify = require('gulp-uglify-es').default;
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var revDel = require('gulp-rev-delete-original');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var logger = require('gulp-logger');

//////////////////////////////////////////////////////////////////////
// File name revision                                               //
//////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////
//// Copy                                                             //
////////////////////////////////////////////////////////////////////////

// Tasks
//// Copy assets in dev folder
gulp.task('copy:dev', function() {
	return gulp
		.src([config.base + '/**/*', '!' + config.base + '/src'])
		.pipe(gulp.dest(config.dev))
		.pipe(
			size({
				title: 'copy'
			})
		);
});

// Copy dev assets
gulp.task('copy:dev:assets', function() {
	return gulp
		.src([
			config.base + '/**/*',
			'!' + config.base + '/src',
			'!' + config.base + '/**/*.html'
		])
		.pipe(gulp.dest(config.dev))
		.pipe(
			size({
				title: 'copy'
			})
		);
});

//// Copy assets in dist folder
gulp.task('copy', function() {
	return gulp
		.src([
			config.base + '/*',
			'!' + config.base + '/*.html',
			'!' + config.base + '/src'
		])
		.pipe(gulp.dest(config.dist))
		.pipe(
			size({
				title: 'copy'
			})
		);
});

//// Copy assets in dist folder
gulp.task('copy:assets', function() {
	return gulp
		.src(config.assets, {
			dot: true
		})
		.pipe(gulp.dest(config.dist + '/assets'))
		.pipe(
			size({
				title: 'copy:assets'
			})
		);
});

//// Copy over the social and site config assets and place them in the root of the dist
gulp.task('copy:images', function() {
	return gulp
		.src('build/dist/assets/img/site/*')
		.pipe(gulp.dest('build/dev/assets/img/site'))
		.pipe(
			size({
				title: 'copy:images'
			})
		);
});

//// Copy over the social and site config assets and place them in the root of the dist
gulp.task('copy:fav', function() {
	return gulp
		.src([config.base + '/assets/img/fav/*', config.base + '/assets/site-config/*'])
		.pipe(gulp.dest(config.dist))
		.pipe(
			size({
				title: 'copy:fav'
			})
		);
});


//////////////////////////////////////////////////////////////////////
// Images                                                           //
//////////////////////////////////////////////////////////////////////

// Tasks
//// Create the favicon from the png
gulp.task('favicon', gulp.series('copy:fav', function() {
	return gulp
		.src(config.dist + '/favicon.png')
		.pipe(ico('favicon.ico'))
		.pipe(gulp.dest(config.dist));
}));

//// Create the favicon from the png
gulp.task('favicon:dev', gulp.series('copy:fav', function() {
	return gulp
		.src(config.dist + '/favicon.png')
		.pipe(ico('favicon.ico'))
		.pipe(gulp.dest(config.dev));
}));

// Minify SVG's
gulp.task('svg', function(){
	return gulp.src(config.icons + '.svg')
        .pipe(svgmin())
        //.pipe(gulp.dest(config.icons));
});

//// Generate responsive images for the site
// gulp.task('images', function() {
// 	return gulp
// 		.src(config.responsiveimages)
// 		.pipe(gulp.dest(config.dist + '/assets/img/site/'))
// 		.pipe(
// 			size({
// 				title: 'img'
// 			})
// 		);
// });


gulp.task('images', function () {
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
		.pipe(gulp.dest(config.dist + '/assets/img/site/'))
});


//////////////////////////////////////////////////////////////////////
// SASS to CSS                                                      //
//////////////////////////////////////////////////////////////////////

//// Sass compilation, sourcemaps, autoprefixing and minification

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


//////////////////////////////////////////////////////////////////////
// JS Minification                                                  //
//////////////////////////////////////////////////////////////////////

// Tasks
gulp.task('scripts', function() {
    return gulp.src(config.js)
	.pipe(uglify())
    .pipe(gulp.dest(config.dist + '/assets/js/'))
});


//////////////////////////////////////////////////////////////////////
// Clean                                                           //
//////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////
// HTML Build                                                       //
//////////////////////////////////////////////////////////////////////

//// Concat CSS & JS files into single files, adds unique cache busting strings
//// Allows dev/prod if statements to show and hide content based on environment

// Tasks
// gulp.task('html:dev', function() {
// 	return gulp
// 		.src(config.devhtml)
// 		.pipe(preprocess({ context: { NODE_ENV: 'dev' } }))
// 		.pipe(gulp.dest(config.dev));
// });

gulp.task('html', function() {
	var manifest = gulp.src('build/dist/assets/rev-manifest.json');
	return gulp
		.src('./build/dist/**/*.html')
		.pipe(
			useref({
				searchPath: '{build,client}'
			})
		)
		.pipe(preprocess({ context: { NODE_ENV: 'prod' } }))
		.pipe(gulp.dest(config.dist))
		.pipe(
			size({
				title: 'html'
			})
		);
});


//////////////////////////////////////////////////////////////////////
// Panini Combine HTML Files                                        //
//////////////////////////////////////////////////////////////////////

// Tasks
gulp.task('panini:dev', function() {
  gulp.src('./client/pages/**/*.html')
  .pipe(logger({
	before: 'Starting panini...',
	after: 'panini complete!',
	showChange: true
}))
    .pipe(panini({
      root: './client/pages/',
      layouts: './client/layouts/',
      partials: './client/partials/',
      helpers: './client/helpers/',
      data: './client/data/'
	}))
	.on(
		'error',
		notify.onError({
			title: 'Panini ERROR',
			message: '<%= error.message %>',
			sound: true
		})
	)
	.pipe(gulp.dest(config.dev));
});

gulp.task('panini', function() {
	gulp.src('./client/pages/**/*.html')
	.pipe(logger({
		before: 'Starting panini...',
		after: 'panini complete!',
		showChange: true
	}))
	  .pipe(panini({
		root: './client/pages/',
		layouts: './client/layouts/',
		partials: './client/partials/',
		helpers: './client/helpers/',
		data: './client/data/'
	  }))
	  .on(
		  'error',
		  notify.onError({
			  title: 'Panini ERROR',
			  message: '<%= error.message %>',
			  sound: true
		  })
	  )
	  .pipe(gulp.dest(config.dist));
  });

gulp.task('resetPages', function(){
	panini.refresh();
});

//////////////////////////////////////////////////////////////////////
// Sketch                                                           //
//////////////////////////////////////////////////////////////////////

// Setup
// var gulp = require('gulp');
// var run = require('gulp-run-command').default;

// // Tasks
// //// Export assets from sketch file
// gulp.task(
// 	'sketch',
// 	run(
// 		'sketchtool export slices --compact=YES --save-for-web=YES sketch/static-starter-v2.sketch --output=client/img'
// 	)
// );


//////////////////////////////////////////////////////////////////////
// Builds                                                           //
//////////////////////////////////////////////////////////////////////

// Tasks
//// Build files for creating a dist release for production
gulp.task('build:dist', gulp.series('clean', function(cb) {
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
}));

//// Build files for local development
gulp.task('build:dev', gulp.series('clean', function(cb) {
	runSequence(
		['svg'],
		['sass', 'copy:dev', 'images'],
		['copy:images'],
		['panini:dev'],
		cb
	);
}));


//////////////////////////////////////////////////////////////////////
// Local development server                                         //
//////////////////////////////////////////////////////////////////////

//// Run the development server after having built generated files, and watch for changes
// Tasks
//// Development
gulp.task('serve', function() {
	runSequence('build:dev', function() {
		browserSync({
			notify: true,
			server: ['build:dev', config.dev]
		});
	});

	gulp.watch(config.scss, gulp.series('sass', reload));
	gulp.watch('./client/pages/**/*.html', gulp.series('panini:dev', reload));
    gulp.watch(['./client/{layouts,partials}/**/*.html'], gulp.series('resetPages', 'panini:dev', reload));
	gulp.watch(['./client/data/**/*.json'], gulp.series('resetPages', 'panini:dev', reload));
	gulp.watch(['./client/helpers/**/*.js'], gulp.series('resetPages', 'panini:dev', reload));
	gulp.watch([config.base + '/**/*', '!' + config.html, '!' + config.scss], gulp.series('copy:dev:assets', reload));
});

//// Run the prod site packed in the dist folder
gulp.task('serve:dist', gulp.series('build:dist', function() {
	browserSync({
		notify: false,
		server: [config.dist]
	});
}));


//////////////////////////////////////////////////////////////////////
// Email Generation                                                 //
//////////////////////////////////////////////////////////////////////

// // Tasks
// //// Email generation development server
// gulp.task('email', function() {
// 	runSequence('build:email', function() {
// 		browserSync({
// 			notify: true,
// 			server: ['build:email', config.dev]
// 		});
// 	});
// 	gulp.watch(
// 		config.emailHtml,
// 		['build:email', reload]
// 	);
// 	gulp.watch(
// 		config.email + '/img/**/*',
// 		['build:email', reload]
// 	);
// });


// // Copy the genrated html templates but not the source
// gulp.task('copy:email', function() {
// 	return gulp
// 		.src([config.email + '/**/*'])
// 		.pipe(gulp.dest(config.dev))
// 		.pipe(
// 			size({
// 				title: 'copy email'
// 			})
// 		);
// });

// // Clean the dev folder then copy over the generated html
// gulp.task('build:email', ['clean'], function(cb) {
// 	runSequence(['copy:email'], cb);
// });



// Default task
gulp.task('default', gulp.series('serve'));
