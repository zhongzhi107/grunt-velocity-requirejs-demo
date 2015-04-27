'use strict';

module.exports = function(grunt) {
  function getModulesConfig(dir) {
    var excludeModules = [];
    var moduleConfig = require('../chunks') || {};
    var returnConfig = [];

    for (var key in moduleConfig) {
      returnConfig.push({
        name: key,
        include: moduleConfig[key]
      });
      excludeModules.push(key);
    }

    grunt.file.recurse(dir, function(abspath, rootdir, subdir, filename) {
      if (/page\d\.js/.test(filename)) {
        returnConfig.push({
          name: (subdir ? subdir + '/' : '') + filename.replace('.js', ''),
          exclude: excludeModules
        });
      }
    });
    return returnConfig;
  }

  return {
    dist: {
      // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
      options: {
        appDir: '<%=yo.app%>/static/js',
        baseUrl: '.',
        paths: require('../../app/static/js/common/require-config').paths,
        shim: require('../../app/static/js/common/require-config').shim,
        dir: '<%=yo.dist%>/static/js',
        optimize: 'none',
        findNestedDependencies: true,
        inlineText: true,
        removeCombined: true,
        modules: getModulesConfig('app/static/js')
      }
    }
  };
};
