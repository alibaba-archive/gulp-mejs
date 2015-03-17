'use strict';

var gulp = require('gulp');
var clean = require('gulp-rimraf');
var gulpMejs = require('../index');
var gulpSequence = require('gulp-sequence');

module.exports = function () {

  gulp.task('clean', function () {
    return gulp.src(['test/templates.js'])
    .pipe(clean({force: true}));
  });

  gulp.task('mejs', function () {
    return gulp.src('test/fixtures/*.html')
    .pipe(gulpMejs({filename: 'templates.js'}))
    .pipe(gulp.dest('test'));
  });

  gulp.task('test', gulpSequence('clean', 'mejs'));
};
