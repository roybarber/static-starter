var gulp = require('gulp');
var browserSync = require('browser-sync');
var hb = require('gulp-hb');
var del = require("del");
var plumber = require('gulp-plumber');
var beautify = require('gulp-beautify');
var hbLayouts = require('handlebars-layouts');
var svg = require("gulp-svg-sprite");
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var makeFavIcons = require("favicons").stream;
var changed = require('gulp-changed');
var postcss = require('gulp-postcss');
var c = require('ansi-colors');
var argv = require('yargs').argv;


// -------------------------------------
//   Config
// -------------------------------------
const production = !!argv.production,
	webpackConfig = require('./webpack.config.js'),
	config = {
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
	},
	paths = {
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
//   Local Server
// -------------------------------------
const server = browserSync.create();
// Start the server
function serve(done) {
    server.init({
		server: './dist/',
		port: 4000,
		notify: true,
		open: true
	})
    done();
}
// Manual reload
function reload(done) {
    server.reload();
    done();
}


// -------------------------------------
//   Startup Message
// -------------------------------------
function startup(done) {
	console.log(c.bgRedBright.white(' Static Starter Build System '));
	console.log('');
	if (production) {
		console.log(c.green.bold.underline('🚚 Production mode'));
		console.log('');
	} else {
		console.log(c.green.bold.underline('🔧 Development mode'));
		console.log('');
	}
	done()
}

// -------------------------------------
//   Clean build folders
// -------------------------------------
function clean() {
    return del(paths.dist);
}


// -------------------------------------
//   Favicon generation
// -------------------------------------
function favicons(done) {
	gulp.src(paths.favicons.src)
		.pipe(changed(paths.favicons.dist))
		.pipe(makeFavIcons({
			icons: {
				android: true,
				appleIcon: true,
				appleStartup: false,
				coast: false,
				favicons: true,
				firefox: false,
				windows: false,
				yandex: false
			}
		}))
		.pipe(gulp.dest(paths.favicons.dist))
    done()
}


// -------------------------------------
//   Font copy
// -------------------------------------
function fonts(done) {
    gulp.src(paths.fonts.src)
		.pipe(changed(paths.fonts.dist))
		.pipe(gulp.dest(paths.fonts.dist))
    done()
}


// -------------------------------------
//   Image copy
// -------------------------------------
function images(done) {
    gulp.src(paths.images.src)
		.pipe(changed(paths.images.dist))
		.pipe(gulp.dest(paths.images.dist))
    done()
}


// -------------------------------------
//   Javascript / Babel Transpile
// -------------------------------------
function js() {
	webpackConfig.mode = config.production ? 'production' : 'development';
	webpackConfig.devtool = config.production ? false : 'source-map';
	return gulp.src(paths.scripts.src)
		.pipe(changed(paths.scripts.dist))
		.pipe(plumber(config.plumber))
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(gulp.dest(paths.scripts.dist))
}

// -------------------------------------
//   SVG Sprite generation
// -------------------------------------
function sprites() {
	var svgOptions  = {
		mode: {
			defs: {
				sprite: "../sprite.svg"
			}
		}
	}
	if (!production) {
		svgOptions.mode.defs = {
			example: {
				template: paths.views.partials + '/svg-demo.html',
				dest: '../../../../svg-demo-output.html'
			}
		}
	}
	return gulp.src(paths.sprites.src)
		.pipe(changed(paths.sprites.dist))
		.pipe(svg(svgOptions))
		.pipe(gulp.dest(paths.sprites.dist))
}


// -------------------------------------
//   Tailwind CSS (postcss)
// -------------------------------------
function css() {
	return gulp.src(paths.css.src)
		.pipe(plumber(config.plumber))
		.pipe(postcss())
		.pipe(gulp.dest(paths.css.dist))
		.pipe(browserSync.stream());
}


// -------------------------------------
//   HTML/Handlebars Templates/Views
// -------------------------------------
function views() {
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
}


// -------------------------------------
//   End Message
// -------------------------------------
function end(done) {
    console.log(c.bgRedBright.white(' Static Starter Build System '))
	console.log('')
	console.log(c.green.bold.underline('🚚 Production Build Finished'))
	console.log('')
    done()
}

// -------------------------------------
//   Watch tasks
// -------------------------------------
const watchViews = () => gulp.watch([paths.views.watch, paths.views.data], gulp.series(views, sprites, css, reload));
const watchJS = () => gulp.watch(paths.scripts.watch, gulp.series(js, css, reload));
const watchCSS = () => gulp.watch(paths.css.watch, gulp.series(css, reload));
const watchImages = () => gulp.watch(paths.images.watch, gulp.series(images, reload));
const watchSprites = () => gulp.watch(paths.sprites.watch, gulp.series(sprites, reload));


// -------------------------------------
//   NPM Tasks
// -------------------------------------
// npm run dev
exports.default = gulp.series(startup, gulp.parallel(css, js, fonts, views, favicons, sprites), serve, gulp.parallel(watchViews, watchCSS, watchJS, watchImages, watchSprites))
// npm run build
exports.build = gulp.series( startup, clean, gulp.parallel(css, js, fonts, views, favicons, sprites), end)
// npm run buildserve
exports.buildserve = gulp.series(startup, clean, gulp.parallel(css, js, fonts, views, favicons, sprites), serve);
