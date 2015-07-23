'use strict'
/*
 * https://github.com/teambition/gulp-mejs
 *
 * Licensed under the MIT license.
 */
var gutil = require('gulp-util')
var through = require('through2')
var mejsCompile = require('mejs')
var packageName = require('./package.json').name

module.exports = function (options) {
  return through.obj(gatherFiles, function (callback) {
    if (!this.gatheredFiles) return callback(new gutil.PluginError(packageName, 'no file exist'))
    var mejsFile = mejsCompile.precompile(this.gatheredFiles, options)
    this.push(new gutil.File(mejsFile))
    callback()
  })
}

module.exports.render = function (tplName, data, options) {
  return through.obj(gatherFiles, function (callback) {
    if (!this.gatheredFiles) return callback(new gutil.PluginError(packageName, 'no file exist'))
    var mejs = mejsCompile.initMejs(mejsCompile.precompile(this.gatheredFiles, options), options)
    this.push(new gutil.File({
      path: tplName + '.html',
      contents: new Buffer(mejs.renderEx(tplName, data))
    }))
    callback()
  })
}

function gatherFiles (file, encoding, next) {
  if (file.isNull()) return next()
  if (file.isStream()) return next(new gutil.PluginError(packageName, 'Streaming not supported'))
  if (!this.gatheredFiles) this.gatheredFiles = [file]
  else this.gatheredFiles.push(file)
  next()
}
