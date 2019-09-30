var gulp = require('gulp');
var panini = require('panini');
var notify = require('gulp-notify');
var config = require('../build/build.config.js');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('panini:dev', function() {
  gulp.src('./client/pages/**/*.html')
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