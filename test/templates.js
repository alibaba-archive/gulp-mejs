// **Github:** https://github.com/teambition/mejs
//
// **License:** MIT
/* global module, define, window */

;(function(root, factory) {
  'use strict';

  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else root.Mejs = factory();
}(typeof window === 'object' ? window : this, function() {
  'use strict';

  var hasOwn = Object.prototype.hasOwnProperty;
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  function Mejs(locals) {
    var templates = {};
    this.locals = locals || {};
    this.templates = templates;

    templates['header'] = function(it, __tplName) {
      var ctx = this, __output = "";
      var include = function(tplName, data) { return ctx.render(ctx.resolve(__tplName, tplName), data); }
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
  }

  var proto = Mejs.prototype;

  proto.render = function(tplName, data) {
    return this.get(tplName).call(this, copy(copy({}, this.locals), data), tplName);
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

  proto.resolve = function(from, to) {
    from = toString(from).replace(/[^\/]*\.?[^\/]*$/, '').replace(/\/?$/, '\/');
    to = (to[0] === '/' ? to : (from + to)).replace(/\/\.?\/+/g, '\/');
    while (/\/\.\.\//.test(to)) to = to.replace(/[^\/]*\/\.\.\//g, '');
    return to.replace(/^[\.\/]*/, '');
  };

  proto.escape = function(str) {
    return toString(str).replace(/[&<>"'`]/g, function(match) {
      return htmlEscapes[match];
    });
  };

  function copy(to, from) {
    if (!from) return to;
    for (var key in from) {
      if (hasOwn.call(from, key)) to[key] = from[key];
    }
    return to;
  }

  function toString(str) {
    return str == null ? '' : String(str);
  }

  return Mejs;
}));
