const gulp = require('gulp');
const browsersync = require('browser-sync');
const hb = require('gulp-hb');
const del = require("del");
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const beautify = require('gulp-beautify');
const hbLayouts = require('handlebars-layouts');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const svg = require("gulp-svg-sprite");
const webpack = require('webpack');
const uglify = require('gulp-uglify');
const webpackStream = require('webpack-stream');
const favicons = require("favicons").stream;
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const imageminZopfli = require('imagemin-zopfli');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const postCSSMixins = require('postcss-mixins');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const pxtorem = require('postcss-pxtorem');
const c = require('ansi-colors');
var argv = require('yargs').argv;
const production = !!argv.production;
// -------------------------------------
//   Config
// -------------------------------------
const webpackConfig = require('./webpack.config.js')



    console.log(argv.language);
	console.log(process.env.LANG)


const config = {
	language: process.env.LANG,
	production: production,
	pxtoREM: false,
	plumber: {
		errorHandler: function (error) {
			console.log(c.red(error.message));
			this.emit('end');
		}
	},
	metadata: {
		author: 'Roy Barber',
		year: (new Date()).getFullYear()
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
		srcOther: './src/js/other/*.js',
		distOther: './dist/assets/js/other/',
		watch: './src/assets/js/**/*.js',
	},
	vendors: {
		src: './src/vendors/**/*.*',
		dist: './dist/assets/vendors/'
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
		.pipe(gulp.dest(paths.fonts.dist));
});


// -------------------------------------
//   Task: images
// -------------------------------------
gulp.task('images', function () {
	return gulp.src(paths.images.src)
		.pipe(changed(paths.images.dist))
		.pipe(imagemin([
			imageminPngquant({
				speed: 4,
				quality: [0.8, 0.95],
			}),
			imageminZopfli({
				more: false,
			}),
			imageminMozjpeg({
				progressive: true,
				quality: 90,
			}),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: false },
					{ removeUnusedNS: false },
					{ removeUselessStrokeAndFill: false },
					{ cleanupIDs: false },
					{ removeComments: true },
					{ removeEmptyAttrs: true },
					{ removeEmptyText: true },
					{ collapseGroups: true },
				],
			}),
		]))
		.pipe(gulp.dest(paths.images.dist));
});


// -------------------------------------
//   Task: scripts
// -------------------------------------
gulp.task('scripts:webpack', function () {
	webpackConfig.mode = config.production ? 'production' : 'development';
	webpackConfig.devtool = config.production ? false : 'source-map';

	return gulp.src(paths.scripts.src)
		.pipe(plumber(config.plumber))
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(gulp.dest(paths.scripts.dist))
		.on('end', browsersync.reload);
});

gulp.task('scripts:other', function () {
	return gulp.src(paths.scripts.srcOther)
		.pipe(plumber(config.plumber))
		.pipe(gulpIf(!config.production, sourcemaps.init()))
		.pipe(gulp.dest(paths.scripts.distOther))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min',
		}))
		.pipe(gulpIf(!config.production, sourcemaps.write()))
		.pipe(gulp.dest(paths.scripts.distOther));
});

gulp.task('scripts', gulp.parallel('scripts:webpack', 'scripts:other'));


// -------------------------------------
//   Task: SVG Sprites
// -------------------------------------
gulp.task("sprites", () => {
	return gulp.src(paths.sprites.src)
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
const pxtoremOptions = {
	replace: true,
	propList: ['font', 'font-size', 'line-height', 'letter-spacing', 'margin*', 'padding*', '*width', '*height'],
	mediaQuery: true
};
const CSSpluginsDev = [
	postcssImport,
	postCSSMixins,
	postcssPresetEnv({
		stage: 0,
		features: {
			'nesting-rules': true,
			'color-mod-function': true,
			'custom-media': true,
		},
	}),
	tailwindcss,
	autoprefixer
];
const CSSpluginsProd = [
	postcssImport,
	postCSSMixins,
	postcssPresetEnv({
		stage: 0,
		features: {
			'nesting-rules': true,
			'color-mod-function': true,
			'custom-media': true,
		},
	}),
	tailwindcss,
	autoprefixer,
	cssnano({
		preset: [
			'default', {
				discardComments: { removeAll: true }
			}
		]
	}),
	//pxtorem(pxtoremOptions)
];

gulp.task('postcss', function () {
	return gulp.src(paths.css.src)
		.pipe(plumber(config.plumber))
		.pipe(gulpIf(!config.production, sourcemaps.init()))
		.pipe(gulpIf(config.production, postcss(CSSpluginsProd)))
		.pipe(gulpIf(!config.production, postcss(CSSpluginsDev)))
		.pipe(gulpIf(!config.production, sourcemaps.write('./maps')))
		.pipe(gulpIf(config.pxtoREM, pxtorem(pxtoremOptions)))
		.pipe(gulp.dest(paths.css.dist))
		.pipe(browsersync.stream());
});

// -------------------------------------
//   Task: vendors
// -------------------------------------
gulp.task('vendors', function () {
	return gulp.src(paths.vendors.src)
		.pipe(gulp.dest(paths.vendors.dist))
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
		// Do something here to define the language based on param passed to gulp
		.data(paths.views.lang + '/' + config.language + '.json', {
			base: __dirname,
			parseDataName: function() {
				return 'translation'
			}
		})
		.data(config.metadata)
		// Helpers
		.helpers(hbLayouts)
		.helpers(paths.views.helpers + '/*.js');

	return gulp.src(paths.views.src)
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
	gulp.watch([paths.views.watch,paths.views.data,paths.views.lang], { usePolling: true }, gulp.parallel('views'));
	gulp.watch(paths.css.watch, { usePolling: true }, gulp.parallel('postcss'));
	gulp.watch(paths.scripts.watch, { usePolling: true }, gulp.parallel('scripts'));
	gulp.watch(paths.images.watch, { usePolling: true }, gulp.parallel('images'));
	gulp.watch(paths.sprites.watch, { usePolling: true }, gulp.parallel('sprites'));
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
gulp.task('default', gulp.series(gulp.parallel('postcss', 'scripts', 'images', 'fonts', 'views', 'favicons', 'sprites', 'vendors'), 'server'));


// -------------------------------------
//   Task: build
// -------------------------------------
gulp.task('build', gulp.series('clean', gulp.parallel('postcss', 'scripts', 'images', 'fonts', 'views', 'favicons', 'sprites', 'vendors'), 'end'));

// -------------------------------------
//   Task: build & Serve to test
// -------------------------------------
gulp.task('build:serve', gulp.series('clean', gulp.parallel('postcss', 'scripts', 'images', 'fonts', 'views', 'favicons', 'sprites', 'vendors'), 'server', 'end'));
