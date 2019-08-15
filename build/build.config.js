'use strict';
//basic configuration object used by gulp tasks
module.exports = {
	port: 3000,
	tmp: 'build/tmp',
	dist: 'build/dist',
	dev: 'build/dev',
	base: 'client',
	email: 'email',
	partials: '/partials',
	sketch: 'sketch',
	mainScss: 'client/scss/main.scss',
	scss: 'client/scss/**/*.scss',
	html: [
		'client/**/*.html'
	],
	emailHtml: [
		'email/**/*.html'
	],
	json: './variables.js',
	devhtml: [
		'build/dev/**/*.html'
	],
	js: [
		'client/js/**/*.js',
		'!client/vendor/**/*.js'
	],
	index: 'client/index.html',
	assets: 'client/assets/**',
    images: 'client/img/**/*.{png,gif,jpg,jpeg,svg}',
	icons: 'client/img/icon/**/*.{png,svg}',
	fonts: 'client/fonts/**/*.{svg,eot,woff2,woff,ttf}',
	video: 'client/video/**/*.{mp4,webm,ogg}'
};
