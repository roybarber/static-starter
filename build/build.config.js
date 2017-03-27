'use strict';
//basic configuration object used by gulp tasks
module.exports = {
  port: 3000,
  tmp: 'build/tmp',
  dist: 'build/dist',
  dev: 'build/dev',
  base: 'client',
  mainScss: 'client/scss/main.scss',
  scss: 'client/scss/**/*.scss',
  html: 'client/**/*.html',
  js: [
    'client/js/**/*.js',
    '!client/vendor/**/*.js'
  ],
  index: 'client/index.html',
  assets: 'client/assets/**',
  images: 'client/img/**/*',
  video: 'client/video/**/*',
  banner: ['/** <%= pkg.name %> - <%= pkg.description %> - By: <%= pkg.homepage %> */'].join('\n'),
  config_url: 'https://gist.githubusercontent.com/johnhoulder/8519e7a24dc2dd8327f3d28cfb02259c/raw'
};