// **Github:** https://github.com/teambition/mejs
//
// **License:** MIT
/* global module, define, window */
/* jshint -W069, -W032*/

// Mejs is a compiled templates class, it can be run in node.js or browers

;(function(root, factory) {
  'use strict';

  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else root.Mejs = factory();
}(typeof window === 'object' ? window : this, function() {
  'use strict';

  var hasOwn = Object.prototype.hasOwnProperty;
  var templates = {};
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  function Mejs(locals) {
    this.locals = locals || {};
    this.templates = copy({}, templates);
  }

  Mejs.import = function(tpls) {
    copy(templates, tpls);
    return this;
  };

  var proto = Mejs.prototype;
  proto.copy = copy;

  proto.render = function(tplName, data) {
    return this.get(tplName).call(this, this.copy(data, this.locals), tplName);
  };

  proto.get = function(tplName) {
    if (!hasOwn.call(this.templates, tplName)) throw new Error(tplName + ' is not found');
    return this.templates[tplName];
  };

  proto.add = function(tplName, tplFn) {
    if (hasOwn.call(this.templates, tplName)) throw new Error(tplName + ' is exist');
    this.templates[tplName] = tplFn;
    return this;
  };

  proto.remove = function(tplName) {
    delete this.templates[tplName];
    return this;
  };

  proto.import = function(ns, mejs) {
    if (typeof ns !== 'string') {
      mejs = ns;
      ns = '/';
    } else ns = ns.replace(/\/?$/, '\/');
    for (var tplName in mejs.templates) {
      if (hasOwn.call(mejs.templates, tplName))
        this.add(this.resolve(ns, tplName), mejs.get(tplName));
    }
    return this;
  };

  proto.resolve = function(parent, current) {
    parent = toString(parent);
    current = toString(current).replace(/^([^\.\/])/, '\/$1');
    current = /^\//.test(current) && !/\/$/.test(parent) ?
      current : (parent.replace(/[^\/]*\.?[^\/]*$/, '').replace(/\/?$/, '\/') + current);
    current = current.replace(/\/\.?\/+/g, '\/');
    while (/\/\.\.\//.test(current)) current = current.replace(/[^\/]*\/\.\.\//g, '');
    return current.replace(/^[\.\/]*/, '');
  };

  proto.escape = function(str) {
    return toString(str).replace(/[&<>"'`]/g, function(match) {
      return htmlEscapes[match];
    });
  };

  function copy(dst, src) {
    dst = dst || {};
    for (var key in src) {
      if (!hasOwn.call(dst, key) && hasOwn.call(src, key)) dst[key] = src[key];
    }
    return dst;
  }

  function toString(str) {
    return str == null ? '' : String(str);
  }

  templates['header'] = function(it, __tplName) {
    var ctx = this, __output = "";
    var include = function(tplName, data) { return ctx.render(ctx.resolve(__tplName, tplName), ctx.copy(data, it)); }
    ;__output += "<p>";;__output += ctx.escape(locals.title || 'gulp');__output += " module</p>\n";;__output = [__output, include('user.html', locals.user)].join("");__output += "\n";
    return __output.trim();
  };

  templates['user-list'] = function(it, __tplName) {
    var ctx = this, __output = "";
    ;__output += "<ul>\n  ";; locals.users.forEach(function(user) { ;__output += "    <li>\n      ";;__output += ctx.escape(user.name);__output += "\n    </li>\n  ";; }) ;__output += "</ul>\n";
    return __output.trim();
  };

  templates['user'] = function(it, __tplName) {
    var ctx = this, __output = "";
    ;__output += "<h1>";;__output += ctx.escape(locals.name);__output += "</h1>\n";
    return __output.trim();
  };

  return Mejs;
}));
