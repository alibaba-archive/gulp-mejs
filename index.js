'use strict';
/*
 * https://github.com/teambition/gulp-mejs
 *
 * Licensed under the MIT license.
 */
var gutil = require('gulp-util');
var through = require('through2');
var mejsCompile = require('mejs');
var packageName = require('./package.json').name;

module.exports = function(options) {
  var files = [];

  return through.obj(function(file, encoding, next) {
    if (file.isNull()) return next();
    if (file.isStream()) return next(new gutil.PluginError(packageName,  'Streaming not supported'));
    files.push(file);
    next();
  }, function(callback) {
    var mejsFile = mejsCompile.precompile(files, options);
    this.push(new gutil.File(mejsFile));
    callback();
  });
};
