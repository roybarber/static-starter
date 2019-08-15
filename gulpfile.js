'use strict';

// Setups
var gulp = require('gulp');
const requireDir = require('require-dir')
var config = require('./build/build.config.js');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp', { recurse: true })

// Default task
gulp.task('default', ['serve']);