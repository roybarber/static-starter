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
var changed = require('gulp-changed');
var postcss = require('gulp-postcss');
var c = require('ansi-colors');
var argv = require('yargs').argv;
var glob = require('glob');
var path = require('path');

var iconsInSprite = []
glob.sync("./src/assets/img/svg-sprite/**/*.svg").forEach(function(file) {
	var icon = path.basename(file, path.extname(file))
  	iconsInSprite.push(icon);
})

// -------------------------------------
//   Config
// -------------------------------------
const production = !!argv.production,
	webpackConfig = require('./webpack.config.js'),
	config = {
		production: production,
		plumber: {
			errorHandler: function (error) {
				console.log(c.red(error.message))
				this.emit('end')
			}
		},
		metadata: {
			author: 'Roy Barber',
			year: (new Date()).getFullYear(),
			production: production,
			iconList: iconsInSprite
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
			dist: './dist/',
			watch: './src/**/*.{html,hbs}'
		},
		css: {
			src: './src/assets/css/*.css',
			dist: './dist/assets/css/',
			watch: './src/assets/css/**/*.css'
		},
		fonts: {
			src: './src/assets/fonts/**/*.{woff,woff2,eot,ttf,svg}',
			dist: './dist/assets/fonts/',
			watch: './src/assets/fonts/**/*.{woff,woff2,eot,ttf,svg}'
		},
		otherFiles: {
			src: "./src/assets/other/**/*",
			dist: "./dist/"
		},
		sprites: {
			src: "./src/assets/img/svg-sprite/**/*.svg",
			dist: "./dist/assets/img/svg-sprite/",
			watch: "./src/assets/img/svg-sprite/**/*.svg"
		},
		images: {
			src: [
				'./src/assets/img/**/*.{jpg,jpeg,png,gif,tiff,svg}',
				'!./src/assets/img/favicon/*',
				'!./src/assets/img/svg-sprite/*'
			],
			dist: './dist/assets/img/',
			watch: './src/assets/img/**/*.{jpg,jpeg,png,gif,svg,tiff}'
		},
		scripts: {
			src: './src/assets/js/main.js',
			dist: './dist/assets/js/',
			distOther: './dist/assets/js/other/',
			watch: './src/assets/js/**/*.js'
		},
		assets: {
			dist: './dist/assets/',
			all: './dist/assets/**/*'
		},
		watch: {
			pages: './src/pages/**/*.{html,hbs}',
			partials: './src/components/**/*.{html,hbs}',
			layouts: './src/layouts/**/*.{html,hbs}',
			helpers: './src/helpers/**/*.js',
			data: './src/data/**/*.json'
		}
	}

// -------------------------------------
//   Local Server
// -------------------------------------
const server = browserSync.create(),
	// Start the server
	serve = done => {
		server.init({
			server: './dist/',
			port: 4000,
			notify: true,
			open: true
		})
		done();
	},
	// Manual reload
	reload = done => {
		server.reload();
		done();
	}

// -------------------------------------
//   Startup Message
// -------------------------------------
const startup = done => {
	console.log(c.bgRedBright.white(' Static Starter Build System '))
	console.log('')
	if (production) {
		console.log(c.green.bold.underline('🚚 Production mode'))
		console.log('')
	} else {
		console.log(c.green.bold.underline('🔧 Development mode'))
		console.log('')
	}
	done()
}

// -------------------------------------
//   Clean build folders
// -------------------------------------
const clean = () => {
    return del(paths.dist)
}


// -------------------------------------
//   Favicon generation
// -------------------------------------
const otherFiles = done => {
	gulp.src(paths.otherFiles.src)
		.pipe(gulp.dest(paths.otherFiles.dist))
    done()
}


// -------------------------------------
//   Font copy
// -------------------------------------
const fonts = done => {
    gulp.src(paths.fonts.src)
		.pipe(changed(paths.fonts.dist))
		.pipe(gulp.dest(paths.fonts.dist))
    done()
}


// -------------------------------------
//   Image copy
// -------------------------------------
const images = done => {
    gulp.src(paths.images.src)
		.pipe(changed(paths.images.dist))
		.pipe(gulp.dest(paths.images.dist))
    done()
}


// -------------------------------------
//   Javascript / Babel Transpile
// -------------------------------------
const js = () => {
	webpackConfig.mode = config.production ? 'production' : 'development'
	webpackConfig.devtool = config.production ? false : 'source-map'
	return gulp.src(paths.scripts.src)
		.pipe(changed(paths.scripts.dist))
		.pipe(plumber(config.plumber))
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(gulp.dest(paths.scripts.dist))
}

// -------------------------------------
//   SVG Sprite generation
// -------------------------------------
const sprites = () => {
	var svgOptions  = {
		mode: {
			defs: {
				sprite: "../sprite.svg"
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
const css = () => {
	return gulp.src(paths.css.src)
		.pipe(plumber(config.plumber))
		.pipe(postcss())
		.pipe(gulp.dest(paths.css.dist))
		.pipe(browserSync.stream())
}


// -------------------------------------
//   HTML/Handlebars Templates/Views
// -------------------------------------
const views = () => {
	let hbStream = hb()
		.partials(paths.views.layouts + '**/*.{hbs,html}')
		.partials(paths.views.partials + '**/*.{hbs,html}')
		// Data
		.data(paths.views.data + '/**/*.{js,json}')
		.data(config.metadata)
		// Helpers
		.helpers(hbLayouts)
		.helpers(paths.views.helpers + '/*.js'),
	
		htmlOptions = {}

	if(production){
		htmlOptions = {
			indent_size: 2, preserve_newlines: false
		}
	}

	return gulp.src(paths.views.src)
		.pipe(plumber(config.plumber))
		.pipe(hbStream)
		.pipe(beautify.html(htmlOptions))
		.pipe(gulp.dest(paths.views.dist))
}


// -------------------------------------
//   End Message
// -------------------------------------
const end = done => {
    console.log(c.bgRedBright.white(' Static Starter Build System '))
	console.log('')
	console.log(c.green.bold.underline('🚚 Production Build Finished'))
	console.log('')
    done()
}

// -------------------------------------
//   Watch tasks
// -------------------------------------
const watchViews = () => gulp.watch([paths.watch.pages, paths.watch.partials, paths.watch.helpers, paths.watch.layouts, paths.watch.data], gulp.series(views, css, reload))
const watchJS = () => gulp.watch(paths.scripts.watch, gulp.series(js, css, reload))
const watchCSS = () => gulp.watch(paths.css.watch, gulp.series(css, reload))
const watchImages = () => gulp.watch(paths.images.watch, gulp.series(images, reload))
const watchSprites = () => gulp.watch(paths.sprites.watch, gulp.series(sprites, reload))


// -------------------------------------
//   NPM Tasks
// -------------------------------------
// npm run dev
exports.default = gulp.series(startup, gulp.parallel(css, js, fonts, views, images, otherFiles, sprites), serve, gulp.parallel(watchViews, watchCSS, watchJS, watchImages, watchSprites))
// npm run build
exports.build = gulp.series(startup, clean, gulp.parallel(css, js, fonts, views, images, otherFiles, sprites), end)
// npm run buildserve
exports.buildserve = gulp.series(startup, clean, gulp.parallel(css, js, fonts, views, images, otherFiles, sprites), serve);
