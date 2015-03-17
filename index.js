'use strict';
/*
 * https://github.com/teambition/gulp-mejs
 *
 * Copyright (c) 2014 Yan Qing
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
    if (file.isStream()) return this.emit('error', new gutil.PluginError(packageName,  'Streaming not supported'));
    files.push(file);
    next();
  }, function() {
    var mejsFile = mejsCompile.precompile(files, options);
    this.push(new gutil.File(mejsFile));
    this.push(null);
  });
};
