'use strict';
//basic configuration object used by gulp tasks
module.exports = {
	port: 3000,
	tmp: 'build/tmp',
	dist: 'build/dist',
	dev: 'build/dev',
	base: 'client',
	email: 'email',
	sketch: 'sketch',
	mainScss: 'client/assets/scss/main.scss',
	scss: 'client/assets/scss/**/*.scss',
	html: [
		'build/dist/**/*.html'
	],
	emailHtml: [
		'email/**/*.html'
	],
	json: './variables.js',
	devhtml: [
		'build/dev/**/*.html'
	],
	js: [
		'client/assets/js/**/*.js'
	],
	index: 'client/index.html',
	assets: 'client/assets/**',
	images: 'client/assets/img/**/*.{png,gif,jpg,jpeg,svg}',
	iconPath: '../client/assets/img/icons/',
	icons: 'client/assets/img/icon/**/*.{png,svg}',
	fonts: 'client/assets/fonts/**/*.{svg,eot,woff2,woff,ttf}',
	video: 'client/assets/video/**/*.{mp4,webm,ogg}',
	responsiveimages: 'client/assets/img/site/**/*.{jpg,jpeg}',
	responsivesizes: [
		'128',
		'480',
		'1024',
		'1920',
		'2560'
	]
};
