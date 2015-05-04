'use strict';

module.exports = function(grunt) {
  var url = require('url');
  var path = require('path');
  var fs = require('fs');
  var querystring = require('querystring');

  var app = require('../app');
  var LIVERELOAD_PORT = app.port.liveReload;
  var rewriteRulesSnippet = require('grunt-connect-route/lib/utils').rewriteRequest;
  var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

  // parse velocity template
  function velocityParser (req, res, next) {
    function requireUncached(module){
      var requirePath = path.resolve(process.cwd(), module);
      delete require.cache[requirePath];
      return require(requirePath);
    }

    var routerPage = requireUncached('config/router-page');
    var Engine = require('velocity/lib/engine');

    // parse VM template
    var urlObject = url.parse(req.url);
    var template = routerPage[urlObject.pathname];
    var templateRoot = grunt.config('velocity.root.dev');
    if (grunt.option('dist')) {
      templateRoot = grunt.config('velocity.root.dist');
    }
    var templateAbsPath = path.join(templateRoot, template + '.' + grunt.config('velocity.ext'));

    if (fs.existsSync(templateAbsPath)) {
      var engine = new Engine({
        root: templateRoot,
        template: templateAbsPath
      });
      var contextFile = grunt.config('velocity.data.page') + template;
      var context = {};

      if (fs.existsSync(contextFile + '.js')) {
        try {
          context = requireUncached(contextFile)(req, res);
        }
        catch (e) {
          console.log('\n');
          grunt.warn('File "' + contextFile + '.js" require failed.\n' + e);
        }
      }
      var result = engine.render(context);
      res.setHeader('Content-Type', 'text/html;charset=UTF-8');
      res.end(result);
    } else {
      next();
    }
  }

  return {
    rules: require('../router-api'),
    options: {
      port: grunt.option('port') || require('../app').port.www,
      // change this to '0.0.0.0' to access the server from outside
      hostname: '0.0.0.0',
      //localhost: 'my.yo.com',
      localhost: grunt.option('host') || 'localhost',
    },
    livereload: {
      options: {
        open: 'http://localhost:9001',
        middleware: function (connect) {
          return [
            require('connect-livereload')({ port: LIVERELOAD_PORT }),,
            mountFolder(connect, '.tmp'),
            mountFolder(connect, app.path.app),
            rewriteRulesSnippet,
            velocityParser
          ];
        }
      }
    },
    dist: {
      livereload: false,
      options: {
        middleware: function (connect) {
          return [
            mountFolder(connect, app.path.dist),
            rewriteRulesSnippet,
            velocityParser
          ];
        }
      }
    },
  };
};
