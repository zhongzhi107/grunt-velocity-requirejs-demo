/**
* @fileOverview requirejs paths and shim config
*
* It's required by Gruntfile.js
*/
'use strict';

var baseURL = '/static/js';
try {
  if (CDN_ROOT) {
    baseURL = CDN_ROOT + baseURL;
  }
} catch(e) {}

var require = {

  baseUrl: baseURL,

  paths: {
    jquery: 'lib/jquery/jquery',
    text: 'lib/requirejs-text/text',
    es6: 'lib/js/requirejs-babel/es6',
    babel: 'lib/js/requirejs-babel/babel-4.6.6.min'
  },

  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    jquery: {
      exports: '$'
    },
    underscore: {
      exports: '_'
    }
  },

  config: {
    es6: {
      resolveModuleSource: function(source) {
        return 'es6!' + source;
      }
    }
  },

  pragmasOnSave: {
    excludeBabel: true
  }
};

if ( typeof module === 'object' && typeof module.exports === 'object' ) {
  module.exports = {
    paths: require.paths,
    shim: require.shim,
    config: require.config,
    pragmasOnSave: require.pragmasOnSave
  };
}
