const gulp = require('gulp');
const browsersync = require('browser-sync');
const hb = require('gulp-hb');
const del = require("del");
const plumber = require('gulp-plumber');
const beautify = require('gulp-beautify');
const hbLayouts = require('handlebars-layouts');
const svg = require("gulp-svg-sprite");
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const favicons = require("favicons").stream;
const changed = require('gulp-changed');
const postcss = require('gulp-postcss');
const c = require('ansi-colors');
var argv = require('yargs').argv;
const production = !!argv.production;

// -------------------------------------
//   Config
// -------------------------------------
const webpackConfig = require('./webpack.config.js')

const config = {
	production: production,
	plumber: {
		errorHandler: function (error) {
			console.log(c.red(error.message));
			this.emit('end');
		}
	},
	metadata: {
		author: 'Roy Barber',
		year: (new Date()).getFullYear(),
		production: production
	}
};

const paths = {
	dist: './dist/',
	views: {
		src: './src/pages/**/*.html',
		pages: './src/pages/',
		partials: './src/components/',
		helpers: './src/helpers/',
		layouts: './src/layouts/',
		data: './src/data',
		lang: './src/i18n',
		dist: './dist/',
		watch: './src/**/*.{html,hbs}',
	},
	css: {
		src: './src/assets/css/*.css',
		dist: './dist/assets/css/',
		watch: './src/assets/css/**/*.css',
	},
	fonts: {
		src: './src/assets/fonts/**/*.{woff,woff2,eot,ttf,svg}',
		dist: './dist/assets/fonts/',
		watch: './src/assets/fonts/**/*.{woff,woff2,eot,ttf,svg}',
	},
	favicons: {
		src: "./src/assets/img/favicon/*.{jpg,jpeg,png,gif}",
		dist: "./dist/assets/img/favicons/",
	},
	sprites: {
		src: "./src/assets/img/svg-sprite/*.svg",
		dist: "./dist/assets/img/svg-sprite/",
		watch: "./src/assets/img/svg-sprite/*.svg"
	},
	images: {
		src: [
			'./src/assets/img/**/*.{jpg,jpeg,png,gif,tiff,svg}',
			'!./src/assets/img/favicon/*',
			'!./src/assets/img/svg-sprite/*',
		],
		dist: './dist/assets/img/',
		watch: './src/assets/img/**/*.{jpg,jpeg,png,gif,svg,tiff}',
	},
	scripts: {
		src: './src/assets/js/main.js',
		dist: './dist/assets/js/',
		distOther: './dist/assets/js/other/',
		watch: './src/assets/js/**/*.js',
	},
	assets: {
		dist: './dist/assets/',
		all: './dist/assets/**/*'
	}
};

// -------------------------------------
//   Startup Message
// -------------------------------------
console.log(c.bgRedBright.white(' Static Starter Build System '));
console.log('');
if (production) {
	console.log(c.green.bold.underline('🚚 Production mode'));
	console.log('');
} else {
	console.log(c.green.bold.underline('🔧 Development mode'));
	console.log('');
}

// -------------------------------------
//   Task: clean
// -------------------------------------
gulp.task('clean', function () {
	return del(paths.dist);
});


// -------------------------------------
//   Task: Favicons
// -------------------------------------
gulp.task("favicons", () => {
	return gulp.src(paths.favicons.src)
		.pipe(changed(paths.favicons.dist))
		.pipe(favicons({
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: false,
				coast: false,
				favicons: true,
				firefox: false,
				windows: false,
				yandex: false,
			}
		}))
		.pipe(gulp.dest(paths.favicons.dist))
});


// -------------------------------------
//   Task: fonts
// -------------------------------------
gulp.task('fonts', function () {
	return gulp.src(paths.fonts.src)
		.pipe(changed(paths.fonts.dist))
		.pipe(gulp.dest(paths.fonts.dist));
});


// -------------------------------------
//   Task: images
// -------------------------------------
gulp.task('images', function () {
	return gulp.src(paths.images.src)
		.pipe(changed(paths.images.dist))
		.pipe(gulp.dest(paths.images.dist));
});


// -------------------------------------
//   Task: scripts
// -------------------------------------
gulp.task('scripts', function () {
	webpackConfig.mode = config.production ? 'production' : 'development';
	webpackConfig.devtool = config.production ? false : 'source-map';
	return gulp.src(paths.scripts.src)
		.pipe(changed(paths.scripts.dist))
		.pipe(plumber(config.plumber))
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(gulp.dest(paths.scripts.dist))
		.on('end', browsersync.reload);
});

// -------------------------------------
//   Task: SVG Sprites
// -------------------------------------
gulp.task("sprites", () => {
	return gulp.src(paths.sprites.src)
		.pipe(changed(paths.sprites.dist))
		.pipe(svg({
			shape: {
				dest: "intermediate-svg"
			},
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			}
		}))
		.pipe(gulp.dest(paths.sprites.dist))
		.on("end", browsersync.reload);
});


// -------------------------------------
//   Task: postcss
// -------------------------------------
gulp.task('postcss', function () {
	return gulp.src(paths.css.src)
		.pipe(plumber(config.plumber))
		.pipe(postcss())
		.pipe(gulp.dest(paths.css.dist))
		.pipe(browsersync.stream());
});


// -------------------------------------
//   Task: views
// -------------------------------------
gulp.task('views', function () {
	let hbStream = hb()
		.partials(paths.views.layouts + '**/*.{hbs,html}')
		.partials(paths.views.partials + '**/*.{hbs,html}')
		// Data
		.data(paths.views.data + '/**/*.{js,json}')
		.data(config.metadata)
		// Helpers
		.helpers(hbLayouts)
		.helpers(paths.views.helpers + '/*.js');

	return gulp.src(paths.views.src)
		.pipe(changed(paths.views.dist))
		.pipe(plumber(config.plumber))
		.pipe(hbStream)
		.pipe(beautify.html({
			indent_size: 2, preserve_newlines: false,
		}))
		.pipe(gulp.dest(paths.views.dist))
		.on('end', browsersync.reload);
});


// -------------------------------------
//   Tast: server
// -------------------------------------
gulp.task('server', function (done) {
	browsersync.init({
		server: './dist/',
		port: 4000,
		notify: true,
		open: false
	});
	gulp.watch([paths.views.watch,paths.views.data], gulp.parallel('views', 'postcss'));
	gulp.watch(paths.css.watch, gulp.parallel('postcss'));
	gulp.watch(paths.scripts.watch, gulp.parallel('scripts'));
	gulp.watch(paths.images.watch, gulp.parallel('images'));
	gulp.watch(paths.sprites.watch, gulp.parallel('sprites'));
	return done();
});

// -------------------------------------
//   End Message
// -------------------------------------
gulp.task('end', function (done) {
	console.log(c.bgRedBright.white(' Static Starter Build System '));
	console.log('');
	console.log(c.green.bold.underline('🚚 Production Build Finished'));
	console.log('');
	return done();
});


// -------------------------------------
//   Task: default
// -------------------------------------
gulp.task('default', gulp.series(gulp.parallel('postcss', 'scripts', 'fonts', 'views', 'favicons', 'sprites'), 'server'));


// -------------------------------------
//   Task: build
// -------------------------------------
gulp.task('build', gulp.series('clean', gulp.parallel('postcss', 'scripts', 'fonts', 'views', 'favicons', 'sprites'), 'end'));

// -------------------------------------
//   Task: build & Serve to test
// -------------------------------------
gulp.task('build:serve', gulp.series('clean', gulp.parallel('postcss', 'scripts', 'fonts', 'views', 'favicons', 'sprites'), 'server'));
